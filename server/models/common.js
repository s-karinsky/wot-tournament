import mongoose from 'mongoose'

const statsMap = {
  battles: Number,
  damage: Number,
  spotted: Number,
  damageSpotted: Number,
  blocked: Number,
  stun: Number
}
export const statsSchema = new mongoose.Schema({
  random: statsMap,
  assault: statsMap,
  meeting: statsMap
}, {
  timestamps: true
})