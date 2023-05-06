import express from 'express'
import Tournament from '../../models/tournament.js'
import tanksData from '../../json/tanks.json' assert { type: 'json' }

const router = express.Router()

router.post('/', function(req, res) {
  const data = req.body
  data.minFights = parseInt(data.minFights)
  data.level = parseInt(data.level)
  data.resetCount = parseInt(data.resetCount)
  data.tanks = tanksData.filter(tank => data.tanks.includes(tank.id)).map(({ id, ...tank }) => tank)
  Tournament.create(data)
    .then(result => {
      res.status(200).json({
        success: true,
        result
      })
    })
    .catch(error => {
      res.status(500).json({ error })
    })
})

export default router