import express from 'express'
import checkRights from '../../middleware/checkRights.js'
import clansRouter from './clans.js'
import moderatorRouter from './moderator.js'
import reservesRouter from './reserves.js'
import settingsRouter from './settings.js'
import usersRouter from './users.js'

const router = express.Router()
router.use(checkRights)
router.use('/clans', clansRouter)
router.use('/moderator', moderatorRouter)
router.use('/reserves', reservesRouter)
router.use('/settings', settingsRouter)
router.use('/users', usersRouter)

export default router