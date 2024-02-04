import express from 'express'
import Ban from '../../models/ban.js'
import Clan from '../../models/clan.js'
import User from '../../models/user.js'

const router = express.Router()

router.post('/ban', async (req, res) => {
  const { id, clanId, banned, endDate, reason } = req.body
  if (id && !banned) {
    await Ban.findByIdAndDelete(id)
    res.json({ success: true })
    return
  }
  if (banned && endDate && reason) {
    await Ban.create({ type: 'clan', id: clanId, endDate, reason })
    res.json({ success: true })
    return
  }
  res.status(500).json({ success: false, message: 'Bad params' })
})

router.get('/', async (req, res) => {
  const { id } = req.query

  if (id) {
    const clan = await Clan.findOne({ clanId: id })
    if (!clan) {
      res.status(500).json({ success: false, message: 'Clan not found' })
      return
    }
    const ban = await Ban.findOne({ type: 'clan', id, endDate: { $gte: Date.now() } })
    const users = await User.find({ clanId: id })
    res.json({ success: true, clan, users, ban })
    return
  }

  const clans = await Clan.find({})
  res.json({ success: true, clans })
})

export default router