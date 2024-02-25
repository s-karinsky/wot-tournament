import express from 'express'
import checkRights from '../../middleware/checkRights.js'
import clansRouter from './clans.js'
import moderatorRouter from './moderator.js'
import usersRouter from './users.js'

const router = express.Router()
router.use(checkRights)
router.use('/clans', clansRouter)
router.use('/moderator', moderatorRouter)
router.use('/users', usersRouter)

export default router