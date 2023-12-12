import express from 'express'
import Tournament from '../../models/tournament.js'
import auth from '../../middleware/auth.js'
import { dateToNumber } from '../../utils/utils.js'

const router = express.Router()

router.use(auth)

router.get('/', async function(req, res) {
  const { id, dateRange, limit } = req.query
  const clan_id = req.session?.user?.clan_id

  if (id) {
    try {
      const tournament = await Tournament.findById(id)
      if (tournament.clanId && tournament.clanId !== clan_id) {
        res.json({ success: false, error: 'You have not access to this tournament' })
      } else {
        res.json({ success: true, tournament })
      }
    } catch (error) {
      res.json({ success: false, error })
    }
    return
  }
  const filter = {}
  const options = {}
  if (dateRange && dateRange.split(';').length === 2) {
    const dates = dateRange.split(';')
    const startDate = dateToNumber(dates[0])
    const endDate = dateToNumber(dates[1])
    filter.startDate = { '$lte': endDate }
    filter.endDate = { '$gte': startDate }
  }
  if (clan_id) {
    filter.$or = [ { clanId: clan_id }, { clanId: null } ]
  } else {
    filter.clanId = null
  }
  if (limit) {
    options.limit = limit
  }

  try {
    const tournaments = await Tournament.find(filter, null, options)
    res.json({ success: true, tournaments })
  } catch (error) {
    res.status(400).json({ success: false, error: error.message })
  }
})

export default router