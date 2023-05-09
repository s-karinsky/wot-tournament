import express from 'express'
import jwt from 'json-web-token'
import auth from '../middleware/auth.js'
import axios from '../utils/axios.js'

const { API_KEY, JWT_SECRET } = process.env

const router = express.Router()

router.use(auth)

router.get('/', function(req, res) {
  const { user } = req.session
  if (!user) {
    res.json({ authorized: false })
  } else if (!user.clan_id) {
    res.json({ clan: {}, success: true })
  } else {
    axios.get(`/clans/info/?application_id=${API_KEY}&clan_id=${user.clan_id}`)
      .then(response => {
        const clan = Object.values(response.data?.data)[0]
        const token = req.cookies.token
        const userInClan = clan.members.find(item => user.account_id === String(item.account_id))
        if (!user.clan_role && userInClan) {
          jwt.decode(JWT_SECRET, token, function(error, result) {
            if (!error) {
              jwt.encode(JWT_SECRET, { ...result, clan_role: userInClan.role }, function(err, newToken) {
                res.cookie('token', newToken)
                res.json({ clan, success: true })
              })
            }
          })
        } else {
          res.json({ clan, success: true })
        }

      })
      .catch(error => {
        console.log(error)
        res.status(500).json({ error })
      })
  }
})

export default router