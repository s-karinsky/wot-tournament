import mongoose from 'mongoose'

const reservesSchema = new mongoose.Schema({
  clan: {
    type: String,
    required: true
  },
  weekday: {
    type: Number,
    min: 1,
    max: 7,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  startFrom: {
    type: String,
    enum: ['min', 'max']
  },
  token: {
    type: String
  }
})

const Reserves = mongoose.model('Reserves', reservesSchema)

export default Reserves