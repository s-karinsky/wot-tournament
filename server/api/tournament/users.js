import express from 'express'
import Tournament from '../../models/tournament.js'
import TournamentUser from '../../models/tournamentUser.js'
import getUserStats from '../../utils/getUserStats.js'

const router = express.Router()

const { UPDATE_STATS_MINUTES_DELAY } = process.env

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

  let tournamentUsers = await TournamentUser.find({ tournament: id })
    .populate('tournament')
    .populate('user')

  const now = Date.now()

  const updateUsers = tournamentUsers
    .filter(tournamentUser => {
      const { currentStats = {} } = tournamentUser
      return !currentStats.updatedAt ||
        now - new Date(currentStats.updatedAt) > UPDATE_STATS_MINUTES_DELAY * 60 * 1000
    })
    .map(tournamentUser => {
      const { user: { accountId, _id }, tournament } = tournamentUser
      return getUserStats(accountId, tournament.tanks).then(stats => ({
        userId: _id,
        stats
      }))
    })

  const updates = await Promise.all(updateUsers)

  await Promise.all(
    updates.map(updateUser => {
      const { userId, stats } = updateUser
      return TournamentUser.findOneAndUpdate({
        tournament: id,
        user: userId
      }, {
        currentStats: stats
      })
    })
  )

  tournamentUsers = await TournamentUser.find({ tournament: id })
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
        battles,
        value
      }
    })
    .sort((a, b) => a.value > b.value ? -1 : 1)

  res.json({ success: true, users })
})

export default router