import express from 'express'
import tanksData from '../json/tanks.json' assert { type: 'json' }

const router = express.Router()

router.get('/', (req, res) => {
  const { type = 'any', tier } = req.query || {}
  
  const tanks = tanksData.filter(item => {
    const result = type === 'any' ? true : item.type === type
    return result && item.tier.toString() === tier.toString()
  }).sort((a, b) => {
    if (a.nation === b.nation) {
      return a.name > b.name ? 1 : -1
    }
    return a.nation > b.nation ? 1 : -1
  })

  res.json({ success: true, tanks })
})

export default router