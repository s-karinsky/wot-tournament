import express from 'express'
import auth from '../../middleware/auth.js'
import Tournament from '../../models/tournament.js'
import TournamentUser from '../../models/tournamentUser.js'
import getUserStats from '../../utils/getUserStats.js'

const router = express.Router()

router.use(auth)

router.post('/', async function(req, res) {
  const { id } = req.body
  const { user } = req.session

  if (!id) {
    res.json({ success: false, error: 'Tournament id not passed' })
    return
  }

  if (!user) {
    res.json({ success: false, error: 'Not authorized' })
    return
  }

  try {
    const tournamentUser = await TournamentUser.find({
      tournament: id,
      user: user.user_id
    })
    if (tournamentUser.length > 0) {
      res.json({ success: false, error: 'Already joined' })
      return
    }

    const tournament = await Tournament.findById(id)

    if (!tournament) {
      res.json({ success: false, error: 'Tournament not found' })
      return
    }

    const initialStats = await getUserStats(user.account_id, tournament.tanks)

    const result = await TournamentUser.create({
      user: user.user_id,
      tournament: id,
      date: Date.now(),
      initialStats,
      currentStats: initialStats,
      resetCount: 0
    })

    res.json({ success: true, data: result })
  } catch (error) {
    res.json({ success: false, error: error.message })
  }
})

export default router