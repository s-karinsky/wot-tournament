import mongoose from 'mongoose'

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
  isBanned: {
    type: Boolean
  },
  lastVisit: {
    type: Date
  },
  role: {
    type: String,
    enum: ['admin', 'moderator', 'user'],
    default: 'user'
  }
})

const User = mongoose.model('User', userSchema)

export default User