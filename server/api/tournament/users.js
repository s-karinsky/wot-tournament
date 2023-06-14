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
      const { battleType, condition, minBattles } = tournament
      const { accountId, nickname } = user

      const initialBattles = initialStats[battleType]?.battles
      const currentBattles = currentStats[battleType]?.battles
      const battles = currentBattles - initialBattles

      if (battles < minBattles) {
        // @TODO
      }

      const initialStat = (initialStats[battleType] || {})[condition]
      const currentStat = (currentStats[battleType] || {})[condition]
      const value = currentStat - initialStat

      return {
        nickname,
        accountId,
        minBattles,
        battles,
        value: Math.floor(value / battles)
      }
    })
    .sort((a, b) => a.value > b.value ? -1 : 1)
    .map((item, pos) => ({
      ...item,
      pos: item.battles > item.minBattles ? pos + 1 : '-'
    }))

  res.json({ success: true, users })
})

export default router