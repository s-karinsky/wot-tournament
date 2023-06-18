import Tournament from '../models/tournament.js'
import TournamentUser from '../models/tournamentUser.js'
import getUserStats from './getUserStats.js'

const { UPDATE_STATS_MINUTES_DELAY } = process.env

export default async function(id, query) {
  const now = Date.now()

  const tournament = await Tournament.findById(id)
  if (new Date(tournament.endDate) < now || new Date(tournament.startDate) > now) {
    return Promise.resolve()
  }

  let tournamentUsers = await TournamentUser.find({ tournament: id, ...query })
    .populate('tournament')
    .populate('user')


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

  return Promise.all(
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
}