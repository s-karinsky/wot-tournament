import mongoose from 'mongoose'

const tournamentSchema = new mongoose.Schema({
  clan: String,
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  battleType: {
    type: String,
    required: true,
    enum: ['random', 'assault', 'meeting']
  },
  minFights: {
    type: Number,
    required: true,
    min: 5,
    max: 100
  },
  type: {
    type: String,
    required: true,
    enum: ['any', 'light', 'medium', 'heavy', 'SPG', 'ATSPG']
  },
  condition: {
    type: String,
    required: true,
    enum: ['damage', 'damageHighlight', 'highlight', 'blocking', 'stun']
  },
  level: {
    type: Number,
    required: true,
    min: 6,
    max: 10
  },
  tanks: {
    type: [Object],
    required: true
  },
  resetCount: {
    type: Number,
    required: true,
    min: 1,
    max: 100
  },
  places: {
    type: [String],
    required: true
  }
})

tournamentSchema.virtual('name').get(function() {
  const { clan, tanks, type, level } = this
  const tankNames = tanks.map(tank => tank.name).join(', ')
  return [clan, tankNames, type, level].join(' ')
})

const Tournament = mongoose.model('Tournament', tournamentSchema)

export default Tournament