import express from 'express'
import User from '../../models/user.js'

const router = express.Router()

router.post('/update', async (req, res) => {
  const { id, access } = req.body
  if (!id || !Array.isArray(access)) {
    res.status(500).json({ success: false, message: 'Bad params' })
    return
  }
  const moderator = await User.findOne({ role: 'moderator', _id: id })
  if (!moderator) {
    res.status(500).json({ success: false, message: 'Bad params' })
    return
  }
  await User.updateOne({ _id: id }, { moderatorAccess: access })
  res.json({ success: true })
})

router.get('/', async (req, res) => {
  const { id } = req.query

  if (id) {
    const moderator = await User.findOne({ role: 'moderator', _id: id })
    if (!moderator) {
      res.status(404).json({ success: false, message: 'Moderator not found' })
      return
    }
    res.json({ success: true, moderator })
    return
  }

  const moderators = await User.find({ role: 'moderator' })
  res.json({ success: true, moderators })
})

export default router