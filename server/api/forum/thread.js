import express from 'express'
import Thread from '../../models/thread.js'
import ThreadViews from '../../models/threadViews.js'
import Reply from '../../models/reply.js'
import auth from '../../middleware/auth.js'

const router = express.Router()

router.use(auth)

router.post('/', async function(req, res) {
  const { title, text, onlyClan, onlyAuthorized } = req.query
  const { user: { user_id, clan_id } = {} } = req.session

  if (!user_id) {
    res.status(403).json({ success: false, message: 'Authorize for create thread' })
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

    const [ lastView, reply ] = await Promise.all([
      ThreadViews.create({ user: user_id, thread: threadId, lastView: createdAt }),
      Reply.create({ thread: threadId, user: user_id, text })
    ])

    res.json({ success: true, thread, reply, lastView })
  } catch (error) {
    res.status(400).json({ success: false, error: error.message })
  }
})

router.get('/', async function(req, res) {
  const { id, skip = 0, limit = 20 } = req.query
  const { user: { user_id, clan_id } = {} } = req.session

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
    if (thread.clan && thread.clan !== clanId) {
      res.status(403).json({ success: false, error: 'You have no access to this thread' })
      return
    }

    const [ threadViews, replies ] = await Promise.all([
      ThreadViews.findOne({ user: user_id, thread: id }),
      Reply.find({ thread: id }).sort({ createdAt: 1 })
    ])

    await ThreadViews.findOneAndUpdate({ user: user_id, thread: id }, { lastView: Date.now() })

    res.json({ success: true, thread, lastView: threadViews, replies })
  } else {
    const threadViews = await ThreadViews.find({ user: user_id })
    const mapThreadViews = threadViews.reduce((acc, item) => ({
      ...acc,
      [item.thread]: item
    }), {})
  
    const queryThreadOr = [{ clan: null }]
    if (clan_id) queryThreadOr.push({ clan: clan_id })
    let threads = await Thread.find({})
      .or(queryThreadOr)
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit)

    threads = threads.map(thread => {
      return {
        ...thread._doc,
        lastView: mapThreadViews[thread._id]?.lastView || null
      }
    })
  
    res.json({ success: true, threads })
  }
})

export default router