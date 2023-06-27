import dbConnect from './server/utils/dbConnect.js'

import Tournament from './server/models/tournament.js'
import TournamentUser from './server/models/tournamentUser.js'
import User from './server/models/user.js'
import getUserStats from './server/utils/getUserStats.js'

const args = process.argv.slice(2)
const isRun = args[0] === '--run'

dbConnect().then(async () => {
  console.log('Db connected success')
  if (isRun) {
    const startDate = new Date()
    startDate.setUTCHours(9)
    startDate.setUTCMinutes(0)
    startDate.setUTCSeconds(0)
    startDate.setUTCMilliseconds(0)
    const tournaments = await Tournament.find({ startDate })
    if (!tournaments.length) {
      console.log('Not found tournaments for stopping')
      process.exit(0)
    }
    await Promise.all(tournaments.map(async (tournament) => {
      const { _id, tanks } = tournament
      console.log(`Running tournament ${_id}...`)
      const tournamentUsers = await TournamentUser.find({ tournament: _id })
      const stats = await Promise.all(
        tournamentUsers.map(async (tournamentUser) => {
          const user = await User.findById(tournamentUser.user)
          return getUserStats(user.accountId, tanks).then(res => ({ id: tournamentUser.user, ...res }))
        })
      )
      await Promise.all(
        stats.map(result => {
          const { id, ...stat } = result
          return TournamentUser.findOneAndUpdate({
            user: id
          }, {
            initialStats: stat,
            currentStats: stat
          }).then(() => console.log(`Stats for user ${id} updated`))
        })
      )
      process.exit(0)
    }))
  } else {
    const endDate = new Date()
    endDate.setUTCHours(20)
    endDate.setUTCMinutes(59)
    endDate.setUTCSeconds(59)
    endDate.setUTCMilliseconds(0)
    const tournaments = await Tournament.find({ endDate })
    if (!tournaments.length) {
      console.log('Not found tournaments for stopping')
      process.exit(0)
    }
    await Promise.all(tournaments.map(async (tournament) => {
      const { _id, tanks } = tournament
      console.log(`Stopping tournament ${_id}...`)
      const tournamentUsers = await TournamentUser.find({ tournament: _id })
      const stats = await Promise.all(
        tournamentUsers.map(async (tournamentUser) => {
          const user = await User.findById(tournamentUser.user)
          return getUserStats(user.accountId, tanks).then(res => ({ id: tournamentUser.user, ...res }))
        })
      )
      await Promise.all(
        stats.map(result => {
          const { id, ...stat } = result
          return TournamentUser.findOneAndUpdate({
            user: id
          }, {
            currentStats: stat
          }).then(() => console.log(`Stats for user ${id} updated`))
        })
      )
      process.exit(0)
    }))
  }

})