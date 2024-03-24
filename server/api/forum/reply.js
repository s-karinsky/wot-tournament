import express from 'express'
import Reply from '../../models/reply.js'
import User from '../../models/user.js'
import Thread from '../../models/thread.js'
import auth from '../../middleware/auth.js'
import censor from '../../utils/censor.js'
import getSettings from '../../utils/getSettings.js'
import updateRepliesCount from '../../utils/updateRepliesCount.js'

const router = express.Router()

router.use(auth)

router.post('/', async function(req, res) {
  const { thread_id, text } = req.body
  const { user: { user_id, clan_id } = {} } = req.session

  try {
    if (!user_id) {
      res.status(404).json({ success: false, message: 'Authorize for create reply' })
      return
    }
  
    const user = await User.findById(user_id)
    const isWriteRestrict = user.restrictions.find(item => item.type === 'write')
    if (isWriteRestrict) {
      res.status(403).json({ success: false, message: 'You are not allowed to write on the forum' })
      return
    }

    const thread = await Thread.findById(thread_id)
    const maxAge = await getSettings('forumActiveThreadAge')

    if (thread.closed || (maxAge && new Date().getTime() - new Date(thread.updatedAt).getTime() > maxAge)) {
      res.status(403).json({ success: false, message: 'Thread is closed' })
      return
    }
  
    if (!thread || (thread.clan && thread.clan !== clan_id)) {
      res.status(403).json({ success: false, message: 'You have no access to this thread' })
      return
    }

    const censorReplace = await getSettings('forumCensor')
    const censoredText = censor(text, [censorReplace])
  
    const [ reply ] = await Promise.all([
      Reply.create({ thread: thread_id, user: user_id, text: censoredText }),
      Thread.findByIdAndUpdate(thread_id, { updatedAt: Date.now(), lastUpdateUser: user_id })
    ])

    await updateRepliesCount(user_id)
  
    res.json({ success: true, reply })
  } catch (error) {
    res.status(500).json({ succes: false, error: error.message })
  }
})

export default router