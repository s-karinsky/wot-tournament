import mongoose from 'mongoose'

const settingsSchema = new mongoose.Schema({
  key: {
    type: String,
    enum: ['forumRepliesRank', 'forumActiveThreadAge', 'forumViolations', 'forumCensor']
  },
  forumRepliesRank: {
    type: [{
      repliesCount: Number,
      rank: String
    }]
  },
  forumActiveThreadAge: {
    type: Number
  },
  forumCensor: {
    type: {
      findWords: [String],
      replaceWith: String
    }
  }
})

const Settings = mongoose.model('Settings', settingsSchema)

export default Settings