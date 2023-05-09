import express from 'express'
import createRouter from './create.js'
import getRouter from './get.js'

const router = express.Router()

router.use('/create', createRouter)
router.use('/get', getRouter)

export default router