import express from 'express'
import Thread from '../../models/thread.js'
import ThreadViews from '../../models/threadViews.js'
import User from '../../models/user.js'
import Reply from '../../models/reply.js'
import auth from '../../middleware/auth.js'
import censor from '../../utils/censor.js'
import getSettings from '../../utils/getSettings.js'
import updateRepliesCount from '../../utils/updateRepliesCount.js'

const router = express.Router()

router.use(auth)

router.post('/', async function(req, res) {
  const { title, text, onlyClan, onlyAuthorized } = req.body
  const { user: { user_id, clan_id } = {} } = req.session

  if (!user_id) {
    res.status(403).json({ success: false, message: 'Authorize for create thread' })
    return
  }

  const user = await User.findById(user_id)
  const isWriteRestrict = user.restrictions.find(item => item.type === 'write')
  if (isWriteRestrict) {
    res.status(403).json({ success: false, message: 'You are not allowed to write on the forum' })
    return
  }

  try {
    const createdAt = Date.now()
    const threadData = {
      author: user_id,
      title,
      createdAt,
      updatedAt: createdAt,
      onlyAuthorized
    }
    if (onlyClan) threadData.clan = clan_id
    const thread = await Thread.create(threadData)

    const threadId = thread._id

    const censorReplace = await getSettings('forumCensor')
    const censoredText = censor(text, censorReplace)

    const [ lastView, reply ] = await Promise.all([
      ThreadViews.create({ user: user_id, thread: threadId, lastView: createdAt }),
      Reply.create({ thread: threadId, user: user_id, text: censoredText })
    ])

    await updateRepliesCount(user_id)

    res.json({ success: true, thread, reply, lastView })
  } catch (error) {
    res.status(400).json({ success: false, error: error.message })
  }
})

router.get('/', async function(req, res) {
  const { id, archive, skip = 0, limit = 20 } = req.query
  const { user: { user_id, clan_id } = {} } = req.session

  try {
    if (!user_id) {
      res.status(403).json({ success: false, message: 'Authorize for create thread' })
      return
    }

    const user = await User.findById(user_id)
    const isReadRestrict = user.restrictions.find(item => item.type === 'read')
    if (isReadRestrict) {
      res.status(403).json({ success: false, message: 'You are not allowed to read the forum' })
      return
    }

    if (id) {
      const thread = await Thread.findById(id)
      if (!thread) {
        res.status(404).json({ success: false, error: 'Thread not found' })
        return
      }
      if (thread.onlyAuthorized && !user_id) {
        res.status(403).json({ success: false, error: 'Thread available for authorized users only' })
        return
      }
      if (thread.clan && thread.clan !== clan_id) {
        res.status(403).json({ success: false, error: 'You have no access to this thread' })
        return
      }
  
      const [ threadViews, replies ] = await Promise.all([
        ThreadViews.findOne({ user: user_id, thread: id }),
        Reply.find({ thread: id }).populate('user').sort({ createdAt: 1 })
      ])
  
      await ThreadViews.findOneAndUpdate({ user: user_id, thread: id }, { lastView: Date.now() })
  
      res.json({ success: true, thread, lastView: threadViews, replies })
    } else {
      const threadViews = await ThreadViews.find({ user: user_id })
      const mapThreadViews = threadViews.reduce((acc, item) => ({
        ...acc,
        [item.thread]: item
      }), {})
    
      const query = {}
      if (!user_id) query.onlyAuthorized = false
      const queryThreadOr = [{ clan: null }]
      if (clan_id) queryThreadOr.push({ clan: clan_id })

      let threadsResult = await Thread.find(query)
        .or(queryThreadOr)
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('author')

      const maxAge = await getSettings('forumActiveThreadAge')

      threadsResult = threadsResult.filter(thread => {
        if (archive) {
          return thread.closed || (maxAge && new Date().getTime() - new Date(thread.updatedAt).getTime() > maxAge)
        } else {
          return !thread.closed && (!maxAge || new Date().getTime() - new Date(thread.updatedAt).getTime() < maxAge)
        }
      })

      const threadsUnsorted = await Promise.all(
        threadsResult.map(thread =>
          Reply.findOne({ thread: thread._id })
            .sort({ createdAt: -1 })
            .populate('user')
            .then(reply => ({
              ...thread._doc,
              lastView: mapThreadViews[thread._id]?.lastView || null,
              lastReply: reply
            }))
          // Reply.countDocuments({ thread: thread._id }).then(repliesCount => ({
          //   ...thread._doc,
          //   lastView: mapThreadViews[thread._id]?.lastView || null,
          //   repliesCount
          // }))
        )
      )
      
      const threads = threadsUnsorted.sort((thread1, thread2) => thread1.updatedAt > thread2.updatedAt ? -1 : 1)
    
      res.json({ success: true, threads })
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

export default router