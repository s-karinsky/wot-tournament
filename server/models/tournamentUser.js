import mongoose from 'mongoose'
import { statsSchema } from './common.js'

const tournamentUserSchema = new mongoose.Schema({
  user: {
    type: mongoose.ObjectId,
    ref: 'User',
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
  resetCount: {
    type: Number,
    required: true
  },
  initialStats: statsSchema
})

const TournamentUser = mongoose.model('TournamentUser', tournamentUserSchema)

export default TournamentUser