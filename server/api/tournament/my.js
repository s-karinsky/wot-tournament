import express from 'express'
import auth from '../../middleware/auth.js'
import Tournament from '../../models/tournament.js'
import TournamentUser from '../../models/tournamentUser.js'
import User from '../../models/user.js'

const router = express.Router()

router.use(auth)

router.get('/', async function(req, res) {
  const { id } = req.query
  const { user } = req.session

  if (!user.user_id) {
    res.status(403).json({ success: false })
    return
  }
  
  const query = { user: user.user_id }
  if (id) {
    query.tournament = id
  }

  const tournaments = await TournamentUser.find(query).populate('tournament')
  const result = !id ? tournaments : tournaments[0]

  res.json({ success: true, result })
})

export default router