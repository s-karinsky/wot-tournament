import mongoose from 'mongoose'

const userVisitsSchema = new mongoose.Schema({
  user: {
    type: mongoose.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  ip: {
    type: String
  },
  userAgent: {
    type: String
  }
})

const UserVisits = mongoose.model('UserVisits', userVisitsSchema)

export default UserVisits