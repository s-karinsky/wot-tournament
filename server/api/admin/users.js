import express from 'express'
import Ban from '../../models/ban.js'
import Clan from '../../models/clan.js'
import User from '../../models/user.js'
import TournamentUser from '../../models/tournamentUser.js'
import UserVisits from '../../models/userVisits.js'

const router = express.Router()

router.post('/ban', async (req, res) => {
  const { id, userId, banned, endDate, reason } = req.body
  if (id && !banned) {
    await Ban.findByIdAndDelete(id)
    res.json({ success: true })
    return
  }
  if (banned && endDate && reason) {
    await Ban.create({ type: 'user', id: userId, endDate, reason })
    res.json({ success: true })
    return
  }
  res.status(500).json({ success: false, message: 'Bad params' })
})

router.post('/restrictions', async (req, res) => {
  const { userId, read, read_date, write, write_date } = req.body
  const restrictions = []

  if (read) {
    restrictions.push({
      type: 'read',
      date: read_date
    })
  }
  if (write) {
    restrictions.push({
      type: 'write',
      date: write_date
    })
  }
  try {
    await User.updateOne({ accountId: userId }, { restrictions })
    res.json({ success: true })
  } catch (e) {
    res.status(500).json({ success: false, message: e.message })
  }
})

router.post('/violations', async (req, res) => {
  const { userId, violations } = req.body
  try {
    await User.updateOne({ accountId: userId }, { violations })
    res.json({ success: true })
  } catch (e) {
    res.status(500).json({ success: false, message: e.message })
  }
})

router.get('/', async (req, res) => {
  const { id } = req.query

  if (id) {
    const user = await User.findById(id)
    const visits = await UserVisits.find({ user: id })
    const ban = await Ban.findOne({ type: 'user', id: user.accountId, endDate: { $gte: Date.now() } })
    const clan = user.clanId ? await Clan.findOne({ clanId: user.clanId }) : null
    const tournaments = await TournamentUser.find({ user: id }).populate('tournament')
    res.json({ success: true, user, visits, clan, ban, tournaments })
    return
  }

  const visits = await UserVisits.aggregate([
    {
      $sort: { date: -1 }
    },
    {
      $group: {
        _id: '$user',
        user: { $first: '$user' },
        date: { $first: '$date' },
        ip: { $first: '$ip' }
      }
    },
    {
      $project: {
        user: 1,
        date: 1,
        ip: 1
      }
    }
  ])

  const users = await User.populate(visits, { path: 'user' })

  res.json({ success: true, users })
})

export default router