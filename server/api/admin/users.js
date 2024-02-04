import express from 'express'
import User from '../../models/user.js'
import UserVisits from '../../models/userVisits.js'

const router = express.Router()

router.get('/', async (req, res) => {
  const visits = await UserVisits.aggregate([
    {
      $sort: { date: -1 }
    },
    {
      $group: {
        _id: '$user',
        user: { $first: '$user' },
        date: { $first: '$date' },
        ip: { $first: '$ip' }
      }
    },
    {
      $project: {
        user: 1,
        date: 1,
        ip: 1
      }
    }
  ])

  const users = await User.populate(visits, { path: 'user' })

  res.json({ success: true, users })
})

export default router