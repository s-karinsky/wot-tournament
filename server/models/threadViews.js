import mongoose from 'mongoose'

const threadViewsSchema = new mongoose.Schema({
  user: {
    type: mongoose.ObjectId,
    ref: 'User',
    required: true
  },
  thread: {
    type: mongoose.ObjectId,
    ref: 'Thread',
    required: true
  },
  lastView: {
    type: Date,
    required: true
  }
})

const ThreadViews = mongoose.model('ThreadViews', threadViewsSchema)

export default ThreadViews