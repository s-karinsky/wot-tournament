import User from '../models/user.js'
import Reply from '../models/reply.js'

export default async function(userId) {
  if (!userId) return
  const userReplies = await Reply.find({ user: userId }).countDocuments()
  await User.findByIdAndUpdate(userId, { repliesCount: userReplies })
}