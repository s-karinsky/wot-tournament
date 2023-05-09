import express from 'express'
import auth from '../../middleware/auth.js'
import Tournament from '../../models/tournament.js'
import tanksData from '../../json/tanks.json' assert { type: 'json' }

const router = express.Router()

router.use(auth)

router.post('/', function(req, res) {
  const { user } = req.session
  console.log(user.clan_role)
  if (!user || !user.clan_id || !['commander', 'executive_officer'].includes(user.clan_role)) {
    res.status(403).json({ success: false })
    return
  }

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