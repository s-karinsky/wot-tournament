import mongoose from 'mongoose'

const replySchema = new mongoose.Schema({
  thread: {
    type: mongoose.ObjectId,
    ref: 'Thread',
    required: true
  },
  user: {
    type: mongoose.ObjectId,
    ref: 'User',
    required: true
  },
  text: {
    type: String,
    required: true
  }
}, {
  timestamps: true
})

const Reply = mongoose.model('Reply', replySchema)

export default Reply