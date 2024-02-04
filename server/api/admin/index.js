import express from 'express'
import checkRights from '../../middleware/checkRights.js'
import clansRouter from './clans.js'
import usersRouter from './users.js'

const router = express.Router()
router.use(checkRights)
router.use('/clans', clansRouter)
router.use('/users', usersRouter)

export default router