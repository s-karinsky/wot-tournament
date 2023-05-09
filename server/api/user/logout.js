import express from 'express'
import jwt from 'json-web-token'
import axios from '../../utils/axios.js'

const { API_KEY, JWT_SECRET, API_URL, SITE_URL = API_URL } = process.env

const router = express.Router()

router.get('/', function(req, res) {
  const token = req.cookies.token

  jwt.decode(JWT_SECRET, token, function(error, result) {
    if (error) {
      res.status(500).json(error)
      return
    }
    axios.post(`/auth/logout/?application_id=${API_KEY}&access_token=${result.access_token}`)
      .then(() => {
        req.session.user = null
        req.session.clan = null
        res.clearCookie('token')
        res.redirect(SITE_URL)
      })
      .catch(error => {
        res.status(500).json(error)
      })
  })
})

export default router