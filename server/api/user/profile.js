import express from 'express'
import jwt from 'json-web-token'
import axios from '../../utils/axios.js'

const { JWT_SECRET, API_KEY } = process.env

const router = express.Router()

router.get('/', function(req, res) {
  const token = req.cookies.token
  if (!token) {
    res.status(403).json({ success: false, error: 403 })
    return
  }
  
  jwt.decode(JWT_SECRET, token, function(error, result) {
    if (error) {
      res.status(500).json(error)
      return
    }
    if (req.session.user) {
      res.json(req.session.user)
    } else {
      axios.get(`/account/info/?application_id=${API_KEY}&account_id=${result.account_id}&access_token=${result.access_token}`)
        .then(response => {
          const user = Object.values(response.data?.data)[0]
          res.json({ user, success: true })
        })
        .catch(error => {
          res.status(500).json(error)
        })
    }
  })
})

export default router