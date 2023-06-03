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
    res.status(403).json({ success: false, error: 'Not authorized' })
    return
  }

  try {
    const tournamentUser = await TournamentUser.findOne({
      tournament: id,
      user: user.user_id
    })
    if (!tournamentUser) {
      res.json({ success: false, error: 'Not joined' })
      return
    }
    const currentBattles = tournamentUser.currentStats?.random?.battles
    const initialBattles = tournamentUser.initialStats?.random?.battles
    if (currentBattles <= initialBattles) {
      res.json({ success: false, error: 'Stats are empty' })
      return
    }

    const tournament = await Tournament.findById(id)

    if (!tournament) {
      res.json({ success: false, error: 'Tournament not found' })
      return
    }

    const resetLimit = tournament.resetLimit
    const resetCount = tournamentUser.resetCount

    if (resetCount >= resetLimit) {
      res.json({ success: false, error: 'Reset limit reached' })
      return
    }

    const stats = await getUserStats(user.account_id, tournament.tanks)
    
    tournamentUser.initialStats = stats
    tournamentUser.currentStats = stats
    tournamentUser.resetCount += 1
    tournamentUser.lastResetDate = new Date()
    tournamentUser.save()

    res.json({ success: true })
  } catch (error) {
    res.json({ success: false, error: error.message })
  }
})

export default router