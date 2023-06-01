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
  }
})

const User = mongoose.model('User', userSchema)

export default User