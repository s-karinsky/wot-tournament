import mongoose from 'mongoose'

const clanSchema = new mongoose.Schema({
  clanId: {
    type: String,
    required: true
  },
  leaderId: {
    type: String
  },
  leaderName: {
    type: String
  },
  name: {
    type: String
  }
})

const Clan = mongoose.model('Clan', clanSchema)

export default Clan