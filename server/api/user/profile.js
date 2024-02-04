import express from 'express'
import jwt from 'json-web-token'
import User from '../../models/user.js'
import UserVisits from '../../models/userVisits.js'
import axios from '../../utils/axios.js'
import { getTournamentsBan } from '../../utils/queries.js'

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
        if (!account_id || !nickname) {
          throw new Error('empty_account')
        }

        userDb = await User.create({
          accountId: account_id,
          clanId: clan_id,
          nickname
        })
      }

      const visit  = {
        user: userDb._id,
        ip: req.headers['x-forwarded-for']?.split(',').shift() || req.socket?.remoteAddress,
        userAgent: req.headers['user-agent']
      }
      // Проверка посещений с теми же данными последние 10 минут
      // Если такое посещение было, новое не пишется
      const lastVisit = await UserVisits.findOne({
        ...visit,
        date: { '$gte': Date.now() - 10 * 60 * 1000 }
      })
      if (!lastVisit) {
        await UserVisits.create({
          ...visit,
          date: Date.now()
        })
      }

      const ban = await getTournamentsBan(account_id, clan_id)
      if (ban) {
        user.isBanned = true
        user.banType = ban.type
        user.banEndDate = ban.endDate
        user.banReason = ban.reason
      }

      user.restrictions = userDb.restrictions
      user.violations = userDb.violations
      user.repliesCount = userDb.repliesCount || 0
      user.role = userDb.role

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