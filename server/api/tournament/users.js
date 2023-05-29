import express from 'express'
import Tournament from '../../models/tournament.js'
import TournamentUser from '../../models/tournamentUser.js'
import User from '../../models/user.js'
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
      const { user: { stats } } = tournamentUser
      return now - new Date(stats.updatedAt) > UPDATE_STATS_MINUTES_DELAY * 60 * 1000
    })
    .map(tournamentUser => {
      const { user: { accountId }, tournament } = tournamentUser
      return getUserStats(accountId, tournament.tanks).then(stats => ({
        accountId,
        stats
      }))
    })

  const updates = await Promise.all(updateUsers)

  await Promise.all(
    updates.map(updateUser => {
      const { accountId, stats } = updateUser
      return User.findOneAndUpdate({ accountId }, { stats })
    })
  )

  tournamentUsers = await TournamentUser.find({ tournament: id })
    .populate('tournament')
    .populate('user')

  const users = tournamentUsers
    .map(tournamentUser => {
      const { user, tournament, initialStats } = tournamentUser
      const { battleType, condition, minBattles } = tournament
      const { accountId, nickname, stats } = user

      const initialBattles = initialStats[battleType]?.battles
      const currentBattles = stats[battleType]?.battles

      if (currentBattles - initialBattles < minBattles) {
        // @TODO
      }

      const initialStat = (initialStats[battleType] || {})[condition]
      const currentStat = (stats[battleType] || {})[condition]
      const value = currentStat - initialStat

      return {
        nickname,
        accountId,
        value
      }
    })
    .sort((a, b) => a.value > b.value ? -1 : 1)

  res.json({ success: true, users })
})

export default router