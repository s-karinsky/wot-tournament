import express from 'express'
import Ban from '../../models/ban.js'
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
  
    try {
      await updateTournamentUserStats(id)
    } catch (e) {
      if (e.name !== 'Error') {
        console.warn(e)
      }
    }

    const bans = await Ban.find({ endDate: { $gte: Date.now() } })
    const bansClan = bans.filter(item => item.type === 'clan').map(item => item.id)
    const bansUser = bans.filter(item => item.type === 'user').map(item => item.id)
  
    const tournamentUsers = await TournamentUser.find({ tournament: id })
      .populate('tournament')
      .populate('user')
  
    const users = tournamentUsers
      .filter(tournamentUser => {
        const { user: { accountId, clanId } = {} } = tournamentUser
        return !bansClan.includes(clanId) && !bansUser.includes(accountId)
      })
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
        pos: pos + 1,
        prize: tournament.places[pos] || ''
      }))
  
    const unratedUsers = users
      .filter(user => user.battles < user.minBattles)
      .sort((a, b) => a.value > b.value ? -1 : 1)
      .map(item => ({
        ...item,
        pos: '-',
        prize: ''
      }))
  
    res.json({ success: true, users: ratedUsers.concat(unratedUsers) })
  } catch (error) {
    res.status(400).json({ success: false, error: error.message })
  }
})

export default router