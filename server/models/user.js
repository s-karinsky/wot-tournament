import mongoose from 'mongoose'
import { statsSchema } from './common.js'

const userSchema = new mongoose.Schema({
  accountId: {
    type: String,
    required: true,
    unique: true
  },
  nickname: {
    type: String,
    required: true
  },
  clanId: {
    type: String
  },
  stats: statsSchema
})

const User = mongoose.model('User', userSchema)

export default User