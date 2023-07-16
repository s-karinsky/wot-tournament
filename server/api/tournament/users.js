import express from 'express'
import Tournament from '../../models/tournament.js'
import TournamentUser from '../../models/tournamentUser.js'
import updateTournamentUserStats from '../../utils/updateTournamentUserStats.js'

const router = express.Router()

const { UPDATE_STATS_MINUTES_DELAY } = process.env

router.get('/', async function(req, res) {
  const { id } = req.query

  if (!id) {
    res.status(400).json({ success: false, error: 'Tournament id not passed' })
    return
  }

  try {
    const tournament = await Tournament.findById(id)
  
    if (!tournament) {
      res.status(400).json({ success: false, error: 'Tournament not found' })
      return
    }
  
    await updateTournamentUserStats(id)
  
    const tournamentUsers = await TournamentUser.find({ tournament: id })
      .populate('tournament')
      .populate('user')
  
    const users = tournamentUsers
      .map(tournamentUser => {
        const { user, tournament, initialStats, currentStats = {} } = tournamentUser
        const { battleType, conditions, minBattles } = tournament
        const { accountId, nickname } = user
  
        const initialBattles = initialStats[battleType]?.battles
        const currentBattles = currentStats[battleType]?.battles
        const battles = currentBattles - initialBattles
  
        if (battles < minBattles) {
          // @TODO
        }
  
        const initialStat = conditions.reduce(
          (sum, condition) => sum + (initialStats[battleType] || {})[condition]
        , 0)
        const currentStat = conditions.reduce(
          (sum, condition) => sum + (currentStats[battleType] || {})[condition]
        , 0)
        const value = currentStat - initialStat
  
        return {
          nickname,
          accountId,
          minBattles,
          battles,
          value: Math.floor(value / battles)
        }
      })
  
    const ratedUsers = users
      .filter(user => user.battles >= user.minBattles)
      .sort((a, b) => a.value > b.value ? -1 : 1)
      .map((item, pos) => ({
        ...item,
        pos: pos + 1
      }))
  
    const unratedUsers = users
      .filter(user => user.battles < user.minBattles)
      .sort((a, b) => a.value > b.value ? -1 : 1)
      .map(item => ({
        ...item,
        pos: '-'
      }))
  
    res.json({ success: true, users: ratedUsers.concat(unratedUsers) })
  } catch (error) {
    res.status(400).json({ success: false, error: error.message })
  }
})

export default router