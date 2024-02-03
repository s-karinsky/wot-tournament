import mongoose from 'mongoose'

const threadSchema = new mongoose.Schema({
  author: {
    type: mongoose.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    required: true
  },
  updatedAt: {
    type: Date,
    required: true
  },
  lastUpdateUser: {
    type: mongoose.ObjectId,
    ref: 'User'
  },
  clan: Number,
  onlyAuthorized: {
    type: Boolean,
    default: false
  },
  closed: {
    type: Boolean
  }
})

const Thread = mongoose.model('Thread', threadSchema)

export default Thread