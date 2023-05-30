import express from 'express'
import Tournament from '../../models/tournament.js'

const router = express.Router()

router.get('/', async function(req, res) {
  const { id, dateRange, clan, limit } = req.query

  if (id) {
    try {
      const tournament = await Tournament.findById(id)
      res.json({ success: true, tournament })
    } catch (error) {
      res.json({ success: false, error })
    }
    return
  }
  const filter = {}
  const options = {}
  if (dateRange && dateRange.split(';').length === 2) {
    const dates = dateRange.split(';')
    const startDate = new Date(dates[0])
    const endDate = new Date(dates[1])
    filter.startDate = { '$lte': endDate }
    filter.endDate = { '$gte': startDate }
  }
  if (clan) {
    filter.clan = clan
  }
  if (limit) {
    options.limit = limit
  }

  try {
    const tournaments = await Tournament.find(filter, null, options)
    res.send({ success: true, tournaments })
  } catch(error) {
    res.send({ success: false, error })
  }
})

export default router