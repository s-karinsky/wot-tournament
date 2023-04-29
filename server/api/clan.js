import express from 'express'
import axios from '../utils/axios.js'

const { API_KEY } = process.env

const router = express.Router()

router.get('/', function(req, res) {
  axios.get(`/clans/info/?application_id=${API_KEY}&clan_id=570514`)
    .then(response => {
      const { data } = response
      res.json({
        clan: data.data,
        success: true
      })
    })
    .catch(error => {
      res.json({
        success: false,
        error
      })
    })
})

export default router