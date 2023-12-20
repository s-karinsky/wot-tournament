import mongoose from 'mongoose'

const banSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['user', 'clan']
  },
  id: {
    type: String
  },
  endDate: {
    type: Date
  },
  reason: {
    type: String
  }
})

const Ban = mongoose.model('Ban', banSchema)

export default Ban