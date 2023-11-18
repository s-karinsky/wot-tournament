import Tournament from '../models/tournament.js'
import TournamentUser from '../models/tournamentUser.js'
import getUserStats from './getUserStats.js'

const { UPDATE_STATS_MINUTES_DELAY } = process.env

export default async function(id, query) {
  const now = Date.now()

  const tournament = await Tournament.findById(id)

  if (!tournament) {
    return Promise.reject('Tournament not found')
  }

  if (new Date(tournament.endDate) < now) {
    return Promise.resolve()
  }

  let tournamentUsers = await TournamentUser.find({ tournament: id, ...query })
    .populate('tournament')
    .populate('user')

  const updateUsers = tournamentUsers
    .filter(tournamentUser => {
      const { currentStats = {}, initialStats = {} } = tournamentUser

      if (new Date(initialStats.updatedAt).getTime() < new Date(tournament.startDate).getTime()) {
        tournamentUser.updateInitial = true
        return true
      }

      return !currentStats.updatedAt ||
        now - new Date(currentStats.updatedAt) > UPDATE_STATS_MINUTES_DELAY * 60 * 1000
    })
    .map(async (tournamentUser) => {
      const { user: { accountId, _id }, tournament, updateInitial } = tournamentUser
      return await getUserStats(accountId, tournament.tanks).then(stats => ({
        userId: _id,
        stats,
        updateInitial
      }))
    })

  const updates = await Promise.all(updateUsers)

  return Promise.all(
    updates.map(updateUser => {
      const { userId, stats, updateInitial } = updateUser
      const updateObj = {
        currentStats: stats
      }
      if (updateInitial) {
        updateObj.initialStats = stats
      }
      return TournamentUser.findOneAndUpdate({
        tournament: id,
        user: userId
      }, updateObj)
    })
  )
}