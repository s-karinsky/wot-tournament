import express from 'express'
import createRouter from './create.js'
import getRouter from './get.js'
import joinRouter from './join.js'

const router = express.Router()

router.use('/create', createRouter)
router.use('/get', getRouter)
router.use('/join', joinRouter)

export default router