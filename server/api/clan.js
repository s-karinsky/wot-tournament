import express from 'express'
import axios from '../utils/axios.js'

const { API_KEY } = process.env

const router = express.Router()

router.get('/', function(req, res) {
  axios.get(`/clans/info/?application_id=${API_KEY}&clan_id=570514`)
    .then(response => {
      const clan = Object.values(response.data?.data)[0]
      res.json({ clan, success: true })
    })
    .catch(error => {
      res.status(500).json(error)
    })
})

export default router