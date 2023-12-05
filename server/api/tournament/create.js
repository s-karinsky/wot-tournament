import express from 'express'
import auth from '../../middleware/auth.js'
import Tournament from '../../models/tournament.js'
import tanksData from '../../json/tanks.json' assert { type: 'json' }

const router = express.Router()

router.use(auth)

router.post('/', async function(req, res) {
  const { user } = req.session
  if (!user || !user.clan_id || !['commander', 'executive_officer'].includes(user.clan_role)) {
    res.status(403).json({ success: false, error: 'Bad role' })
    return
  }

  const { clanOnly, ...data } = req.body
  data.minBattles = parseInt(data.minBattles)
  data.level = parseInt(data.level)
  data.resetLimit = parseInt(data.resetLimit)
  data.tanks = tanksData.filter(tank => data.tanks.includes(tank.id))
  if (clanOnly) {
    data.clanId = user.clan_id
    data.clanName = user.clan_name
  }

  try {
    const last = await Tournament.findOneAndUpdate({ isLastCreated: true }, { isLastCreated: false })
    const index = last && last.index ? last.index + 1 : 1
    const result = await Tournament.create({ ...data, index })
    res.json({ success: true, result })
  } catch (error) {
    res.status(400).json({ success: false, error: error.message })
  }
})

export default router