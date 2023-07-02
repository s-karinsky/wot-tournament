import express from 'express'
import replyRouter from './reply.js'
import threadRouter from './thread.js'

const router = express.Router()

router.use('/reply', replyRouter)
router.use('/thread', threadRouter)

export default router