import express from 'express'
import jwt from 'json-web-token'

const { API_KEY, API_URL, API_EXTERNAL, JWT_SECRET, SITE_URL = API_URL } = process.env

const router = express.Router()

router.get('/', function(req, res) {
  console.log(req.query)
  if (!req.query?.status) {
    res.redirect(`${API_EXTERNAL}/auth/login/?application_id=${API_KEY}&redirect_uri=${API_URL}/api/user/auth`)
    return
  } else if (req.query.status === 'ok') {
    const { query } = req
    jwt.encode(JWT_SECRET, {
      access_token: query.access_token,
      account_id: query.account_id,
      expires_at: query.expires_at
    }, function(err, token) {
      if (err) {
        res.status(403).json({ message: 'JWT encode error' })
      } else {
        res.cookie('token', token)
        res.redirect(SITE_URL)
      }
    })
  }
})

export default router