import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
  accountId: {
    type: String,
    required: true,
    unique: true
  },
  clanId: {
    type: String
  }
})

const User = mongoose.model('User', UserSchema)

export default User