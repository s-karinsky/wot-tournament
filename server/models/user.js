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
  lastVisit: {
    type: Date
  },
  violations: {
    type: [{
      date: Date,
      reason: String,
      reply: {
        type: mongoose.ObjectId,
        ref: 'Reply'
      }
    }]
  },
  restrictions: {
    type: [{
      type: {
        type: String,
        enum: ['read', 'write']
      },
      date: Date
    }],
  },
  repliesCount: {
    type: Number
  },
  role: {
    type: String,
    enum: ['admin', 'moderator', 'user'],
    default: 'user'
  }
})

const User = mongoose.model('User', userSchema)

export default User