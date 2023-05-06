import express from 'express'
import tanksData from '../json/tanks.json' assert { type: 'json' }

const router = express.Router()

router.get('/', (req, res) => {
  const { type = 'any', level } = req.query || {}
  
  const tanks = tanksData.filter(item => {
    const result = type === 'any' ? true : item.type === type
    return result && item.level.toString() === level.toString()
  }).sort((a, b) => {
    if (a.country === b.country) {
      return a.name > b.name ? 1 : -1
    }
    return a.country > b.country ? 1 : -1
  })

  res.json({ success: true, tanks })
})

export default router