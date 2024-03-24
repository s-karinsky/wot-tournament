import express from 'express'
import Settings from '../../models/settings.js'

const router = express.Router()

router.post('/', async (req, res) => {
  if (!req.body) {
    res.status(403).json({ success: false, message: 'Bad params' })
    return
  }

  const promises = Object.keys(req.body).map(key => {
    return Settings.updateOne({ key }, { key, [key]: req.body[key] }, { upsert: true })
  })
  await Promise.all(promises)
  res.json({ success: true })
})

router.get('/', async (req, res) => {
  const settings = await Settings.find()
  res.json({ success: true, settings })
})

export default router