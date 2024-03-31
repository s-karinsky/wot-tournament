import express from 'express'
import jwt from 'json-web-token'
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
      const response = await axios.get(`/stronghold/clanreserves/?application_id=${API_KEY}&access_token=${result.access_token}`)
      res.json({ data: response.data?.data })
    } catch (e) {
      res.status(500).json({ success: false, message: 'Wot server error', error: e.message })
    }
  })
})

export default router