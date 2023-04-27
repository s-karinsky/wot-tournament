import express from 'express'
import authRouter from './auth.js'
import profileRouter from './profile.js'
import logoutRouter from './logout.js'

const router = express.Router()

router.use('/auth', authRouter)
router.use('/profile', profileRouter)
router.use('/logout', logoutRouter)

export default router