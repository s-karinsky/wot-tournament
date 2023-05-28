import express from 'express'
import Tournament from '../../models/tournament.js'
import TournamentUser from '../../models/tournamentUser.js'

const router = express.Router()

router.get('/', async function(req, res) {
  const { id } = req.query

  if (!id) {
    res.json({ success: false, error: 'Tournament id not passed' })
    return
  }

  const tournament = await Tournament.findById(id)

  if (!tournament) {
    res.json({ success: false, error: 'Tournament not found' })
    return
  }

  // Update status once at hour
  if (Date.now() - new Date(tournament.lastStatsUpdate).getTime() > 60 * 60 * 1000) {

  }

  const users = await TournamentUser.find({ tournamentId: id }).populate('user')

  res.json({ success: true, users })
  return
  const $or = users.reduce((acc, user) => {
    return [ ...acc, { accountId: user.accountId } ]
  }, [])
})

export default router