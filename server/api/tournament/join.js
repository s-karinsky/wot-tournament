import express from 'express'
import auth from '../../middleware/auth.js'
import Tournament from '../../models/tournament.js'
import TournamentUser from '../../models/tournamentUser.js'
import axios from '../../utils/axios.js'

const router = express.Router()

const { API_KEY } = process.env

router.use(auth)

router.post('/', async function(req, res) {
  const { id } = req.body
  const { user } = req.session

  if (!id) {
    res.json({ success: false, error: 'Tournament id not passed' })
    return
  }

  if (!user) {
    res.status(403).json({ success: false, error: 'Not authorized' })
    return
  }

  try {
    const tournamentUser = await TournamentUser.find({ tournamentId: id, accountId: user.account_id })
    if (tournamentUser.length > 0) {
      res.json({ success: false, error: 'Already joined' })
      return
    }

    const tournament = await Tournament.findById(id)

    if (!tournament) {
      res.json({ success: false, error: 'Tournament not found' })
      return
    }

    const tanks = tournament.tanks.map(tank => tank.id).join(',')
    const response = await axios.get(`/tanks/stats/?application_id=${API_KEY}&account_id=${user.account_id}&tank_id=${tanks}`)
    const data = (response.data?.data || {})[user.account_id]

    if (!data || !Array.isArray(data)) {  
      res.json({ success: false, error: 'Can\'t fetch stats, try later '})
      return
    }

    const initialStats = data.reduce((acc, item) => {
      const { all } = item
      if (all) {
        acc.battles += all.battles
        acc.damage += all.damage_dealt
        acc.spotted += all.spotted
        acc.blocked += all.avg_damage_blocked * all.battles
        acc.stun += all.stun_number
      }
      return acc
    }, {
      battles: 0,
      damage: 0,
      spotted: 0,
      blocked: 0,
      stun: 0
    })

    const result = await TournamentUser.create({
      accountId: user.account_id,
      tournamentId: id,
      date: Date.now(),
      initialStats,
      resetCount: 0
    })

    res.json({ success: true, data: result })
  } catch (error) {
    res.json({ success: false, error: error.message })
  }
})

export default router