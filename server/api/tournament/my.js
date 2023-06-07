import express from 'express'
import auth from '../../middleware/auth.js'
import Tournament from '../../models/tournament.js'
import TournamentUser from '../../models/tournamentUser.js'
import updateTournamentUserStats from '../../utils/updateTournamentUserStats.js'

const router = express.Router()

router.use(auth)

router.get('/', async function(req, res) {
  const { id } = req.query
  const { user } = req.session

  const tournament = await Tournament.findById(id)

  if (!user.user_id || !tournament) {
    res.status(403).json({ success: false })
    return
  }
  
  const query = { user: user.user_id }
  if (id) {
    query.tournament = id
    await updateTournamentUserStats(id, query)
  }

  let tournaments = await TournamentUser.find(query).populate('tournament')

  tournaments = tournaments.map(item => ({
    tournament: {
      id: item.tournament.id,
      resetLimit: item.tournament.resetLimit
    },
    resetCount: item.resetCount,
    lastResetDate: item.lastResetDate,
    date: item.date,
    initialStats: item.initialStats[tournament.battleType],
    currentStats: item.currentStats[tournament.battleType]
  }))

  const result = !id ? tournaments : tournaments[0]

  res.json({ success: true, result })
})

export default router