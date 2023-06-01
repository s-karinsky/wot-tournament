import mongoose from 'mongoose'
import { statsSchema } from './common.js'

const tournamentUserSchema = new mongoose.Schema({
  user: {
    type: mongoose.ObjectId,
    ref: 'User',
    required: true
  },
  tournament: {
    type: mongoose.ObjectId,
    ref: 'Tournament',
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
  lastResetDate: {
    type: Date
  },
  initialStats: statsSchema,
  currentStats: statsSchema
})

const TournamentUser = mongoose.model('TournamentUser', tournamentUserSchema)

export default TournamentUser