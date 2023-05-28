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
    enum: ['any', 'lightTank', 'mediumTank', 'heavyTank', 'SPG', 'AT-SPG']
  },
  condition: {
    type: String,
    required: true,
    enum: ['damage', 'damageHighlight', 'highlight', 'blocking', 'stun']
  },
  tier: {
    type: Number,
    required: true,
    min: 6,
    max: 10
  },
  tanks: {
    type: [Object],
    required: true
  },
  resetLimit: {
    type: Number,
    required: true,
    min: 1,
    max: 100
  },
  places: {
    type: [String],
    required: true
  },
  lastStatsUpdate: {
    type: Date
  }
}, {
  toObject: {
    virtuals: true
  },
  toJSON: {
    virtuals: true
  }
})

const LEVEL_OUTPUT = {
  6: 'VI',
  7: 'VII',
  8: 'VIII',
  9: 'IX',
  10: 'X'
}

const TANKS_OUTPUT = {
  any: 'Любой',
  lightTank: 'Лёгкие',
  mediumTank: 'Средние',
  heavyTank: 'Тяжелые',
  SPG: 'САУ',
  'AT-SPG': 'ПТ-САУ'
}

tournamentSchema.virtual('name').get(function() {
  const { clan, tanks, type, tier } = this
  const tankNames = tanks.length > 1 ? 'Любой танк' : tanks.map(tank => tank.short_name).join(', ')
  return [clan, tankNames, TANKS_OUTPUT[type], LEVEL_OUTPUT[tier]].join(' ')
})

const Tournament = mongoose.model('Tournament', tournamentSchema)

export default Tournament