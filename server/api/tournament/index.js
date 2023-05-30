import express from 'express'
import createRouter from './create.js'
import getRouter from './get.js'
import joinRouter from './join.js'
import myRouter from './my.js'
import usersRouter from './users.js'

const router = express.Router()

router.use('/create', createRouter)
router.use('/get', getRouter)
router.use('/join', joinRouter)
router.use('/my', myRouter)
router.use('/users', usersRouter)

export default router