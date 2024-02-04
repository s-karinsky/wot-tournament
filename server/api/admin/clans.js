import express from 'express'
import Clan from '../../models/clan.js'

const router = express.Router()

router.get('/', async (req, res) => {
  const clans = await Clan.find({})
  res.json({ success: true, clans })
})

export default router