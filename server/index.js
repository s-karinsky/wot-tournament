import * as url from 'url'
import path from 'path'
import express from 'express'
import fs from 'fs'
import https from 'https'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import session from 'express-session'
import bodyParser from 'body-parser'

import dbConnect from './utils/dbConnect.js'

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

app.use('/api/clan', clanRouter)
app.use('/api/forum', forumRouter)
app.use('/api/news', newsRouter)
app.use('/api/tanks', tanksRouter)
app.use('/api/tournament', tournamentRouter)
app.use('/api/user', userRouter)

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
})

var httpsServer = https.createServer(credentials, app)

dbConnect().then(() => {
  httpsServer.listen(PORT, () => {
    console.log("Https server listing on port : " + PORT)
  })
})
