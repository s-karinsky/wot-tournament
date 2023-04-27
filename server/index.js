import * as url from 'url'
import path from 'path'
import express from 'express'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import session from 'express-session'

import userRouter from './api/user/index.js'

const __filename = url.fileURLToPath(import.meta.url)
const __dirname = url.fileURLToPath(new URL('.', import.meta.url))

const PORT = process.env.PORT || 3001

const app = express()

app.use(cookieParser())
app.use(morgan('tiny'))
app.use(session({ secret: process.env.SESSION_SECRET }))
app.use(express.static(path.resolve(__dirname, '../client/build')))

app.use('/api/user', userRouter)

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`)
})