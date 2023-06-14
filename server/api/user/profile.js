import express from 'express'
import jwt from 'json-web-token'
import User from '../../models/user.js'
import axios from '../../utils/axios.js'

const { JWT_SECRET, API_KEY } = process.env

const router = express.Router()

router.get('/', function(req, res) {
  const token = req.cookies.token
  if (!token) {
    res.status(403).json({ success: false, error: 403 })
    return
  }
  
  jwt.decode(JWT_SECRET, token, async function(error, result) {
    if (error) {
      res.status(500).json({ success: false, error: error.message })
      return
    }
    try {
      const response = await axios.get(`/account/info/?application_id=${API_KEY}&account_id=${result.account_id}&access_token=${result.access_token}`)
      const user = Object.values(response.data?.data)[0] || {}
      const { account_id, clan_id, nickname } = user
      let userDb = await User.findOne({ accountId: result.account_id })
      if (!userDb) {
        userDb = await User.create({
          accountId: account_id,
          clanId: clan_id,
          nickname
        })
      }
      jwt.encode(JWT_SECRET, { ...result, clan_id, user_id: userDb._id }, function(err, newToken) {
        res.cookie('token', newToken)
        res.json({ user, success: true })
      })
    } catch(error) {
      res.status(500).json({ success: false, error: error.message })
    }
  })
})

export default router