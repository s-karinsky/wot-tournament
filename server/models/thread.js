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
  clan: Number,
  onlyAuthorized: Boolean,
})

const Thread = mongoose.model('Thread', threadSchema)

export default Thread