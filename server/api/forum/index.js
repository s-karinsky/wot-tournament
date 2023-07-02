import express from 'express'
import threadRouter from './thread.js'

const router = express.Router()

router.use('/thread', threadRouter)

export default router