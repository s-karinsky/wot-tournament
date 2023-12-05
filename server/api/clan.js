import express from 'express'
import jwt from 'json-web-token'
import auth from '../middleware/auth.js'
import axios from '../utils/axios.js'

const { API_KEY, JWT_SECRET } = process.env

const router = express.Router()

router.use(auth)

router.get('/', async function(req, res) {
  const { user } = req.session
  if (!user) {
    res.status(403).json({ success: false, error: 'Not authorized' })
  } else if (!user.clan_id) {
    res.json({ success: true, clan: {}  })
  } else {
    try {
      const response = await axios.get(`/clans/info/?application_id=${API_KEY}&clan_id=${user.clan_id}`)
      const clan = Object.values(response.data?.data)[0]
      const token = req.cookies.token
      const userInClan = clan.members.find(item => user.account_id === String(item.account_id))
      if (!user.clan_role && userInClan) {
        jwt.decode(JWT_SECRET, token, function(error, result) {
          if (!error) {
            jwt.encode(JWT_SECRET, { ...result, clan_role: userInClan.role, clan_name: clan.name }, function(err, newToken) {
              res.cookie('token', newToken)
              res.json({ success: true, clan })
            })
          }
        })
      } else {
        res.json({ success: true, clan })
      }
    } catch (error) {
      res.status(500).json({ success: false, error: error.message })
    }
  }
})

export default router