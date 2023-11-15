import mongoose from 'mongoose'
import { localeMonths } from '../const.js'

const tournamentSchema = new mongoose.Schema({
  clanId: Number,
  clanName: String,
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
  minBattles: {
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
  conditions: {
    type: [String],
    required: true,
    enum: ['damage', 'damageSpotted', 'spotted', 'blocked', 'stun']
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
  index: {
    type: Number
  },
  isLastCreated: {
    type: Boolean,
    default: true
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

tournamentSchema.pre('save', function(next) {
  // 12:00 Мск
  this.startDate.setUTCHours(9)
  this.startDate.setUTCMinutes(0)
  this.startDate.setUTCSeconds(0)
  this.startDate.setUTCMilliseconds(0)
  // 24:00 Мск
  this.endDate.setUTCHours(20)
  this.endDate.setUTCMinutes(59)
  this.endDate.setUTCSeconds(59)
  this.endDate.setUTCMilliseconds(0)
  next()
})

tournamentSchema.virtual('name').get(function() {
  const { clanName, tanks, type, tier, startDate, endDate, clanId, index } = this
  if (index) {
    const dateStart = new Date(startDate)
    const dateEnd = new Date(endDate)
    const monthStart = localeMonths[dateStart.getMonth()]
    const monthEnd = localeMonths[dateEnd.getMonth()]
    const month = monthStart === monthEnd ? monthStart : `${monthStart}-${monthEnd}`
    return `${clanId ? 'Клановый турнир' : 'Турнир'} № ${index} (${month} ${dateStart.getFullYear()})`
  }
  const tankNames = tanks.length > 1 ? 'Любой танк' : tanks.map(tank => tank.short_name).join(', ')
  return [clanName, tankNames, TANKS_OUTPUT[type], `${LEVEL_OUTPUT[tier]} ур.`].join(' ')
})

const Tournament = mongoose.model('Tournament', tournamentSchema)

export default Tournament