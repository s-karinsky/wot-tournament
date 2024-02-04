import * as url from 'url'
import path from 'path'
import express from 'express'
import fs from 'fs'
import http from 'http'
import https from 'https'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import session from 'express-session'
import bodyParser from 'body-parser'
import dbConnect from './utils/dbConnect.js'
import adminRouter from './api/admin/index.js'
import clanRouter from './api/clan.js'
import forumRouter from './api/forum/index.js'
import newsRouter from './api/news.js'
import tanksRouter from './api/tanks.js'
import tournamentRouter from './api/tournament/index.js'
import userRouter from './api/user/index.js'

const __filename = url.fileURLToPath(import.meta.url)
const __dirname = url.fileURLToPath(new URL('.', import.meta.url))

const key = fs.readFileSync(__dirname + 'cert/www.tankbrothers.ru.key');
const cert = fs.readFileSync(__dirname + 'cert/www.tankbrothers.ru.crt');

const PORT = process.env.PORT || 3001
const IS_DEV = process.env.NODE_ENV === 'development'

const credentials = { key, cert }

const app = express()

app.use(bodyParser.json())
app.use(cookieParser())
app.use(morgan('tiny'))
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}))
app.use(express.static(path.resolve(__dirname, '../client/build')))
app.use('/admin', express.static(path.resolve(__dirname, '../admin/build')))

app.use('/api/admin', adminRouter)
app.use('/api/clan', clanRouter)
app.use('/api/forum', forumRouter)
app.use('/api/news', newsRouter)
app.use('/api/tanks', tanksRouter)
app.use('/api/tournament', tournamentRouter)
app.use('/api/user', userRouter)

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
})

const httpServer = http.createServer(app)
const httpsServer = https.createServer(credentials, app)
const server = IS_DEV ? httpServer : httpsServer

dbConnect().then(() => {
  server.listen(PORT, () => {
    console.log(`${IS_DEV ? 'http' : 'https'} server listing on port ` + PORT)
  })
})
