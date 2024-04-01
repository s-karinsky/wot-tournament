import express from 'express'
import jwt from 'json-web-token'
import Reserves from '../../models/reserves.js'
import axios from '../../utils/axios.js'

const { JWT_SECRET, API_KEY } = process.env

const router = express.Router()

router.get('/', async (req, res) => {
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
      const reserves = await Reserves.find({ clan: result.clan_id }).exec()
      const initialValues = (reserves || []).reduce((acc, item) => ({
        ...acc,
        [`${item.weekday}-${item.type}`]: {
          time: item.time,
          startFrom: item.startFrom
        }
      }), {})
      const response = await axios.get(`/stronghold/clanreserves/?application_id=${API_KEY}&access_token=${result.access_token}`)
      res.json({ data: response.data?.data, initialValues })
    } catch (e) {
      res.status(500).json({ success: false, message: 'Wot server error', error: e.message })
    }
  })
})

router.post('/', async (req, res) => {
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
      if (!req.body || !req.body.data || !req.body.clan) {
        res.status(403).json({ success: false, message: 'Bad params' })
        return
      }
      const { data, clan } = req.body
      const promises = data.map(item => Reserves.updateOne({ weekday: item.weekday, type: item.type, clan, token: result.access_token }, item, { upsert: true }))
      await Promise.all(promises)
      res.json({ success: true })
    } catch (e) {
      res.status(500).json({ success: false, error: e })
    }
  })
})

export default router