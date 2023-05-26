import mongoose from 'mongoose'

const tournamentUserSchema = new mongoose.Schema({
  accountId: {
    type: String,
    required: true
  },
  tournamentId: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  initialStats: {
    battles: Number,
    damage: Number,
    spotted: Number,
    blocked: Number,
    stun: Number
  },
  resetCount: {
    type: Number
  }
})

const TournamentUser = mongoose.model('TournamentUser', tournamentUserSchema)

export default TournamentUser