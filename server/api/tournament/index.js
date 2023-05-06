import express from 'express'
import createRouter from './create.js'

const router = express.Router()

router.use('/create', createRouter)

export default router