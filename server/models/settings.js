import mongoose from 'mongoose'

const settingsSchema = new mongoose.Schema({
  forumRepliesRank: {
    type: [{
      repliesCount: Number,
      rank: String
    }]
  },
  forumActiveThreadAge: {
    type: Number
  },
  forumViolations: {
    type: [String]
  },
  forumCensor: {
    type: [{
      findWords: [String],
      replaceWith: String
    }]
  }
})

const Settings = mongoose.model('Settings', settingsSchema)

export default Settings