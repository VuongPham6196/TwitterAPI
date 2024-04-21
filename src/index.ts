import express from 'express'
import usersRouter from './routes/users.routes'
import databaseServices from './services/database.services'
import defaultErrorHandler from './middlewares/errors.middlewares'
import cors from 'cors'
import mediasRoute from './routes/medias.routes'
import { initFolder } from './utils/file'
import staticRoute from './routes/statics.routes'
import tweetsRouter from './routes/tweets.routes'
import bookmarksRouter from './routes/bookmarks.routes'
import likesRouter from './routes/likes.routes'
import searchRouter from './routes/search.routes'
import { createServer } from 'http'
import conversationsRouter from './routes/conversations.routes'
import createIOSocket from './utils/socket'
import { envConfig } from './utils/config'
// import './utils/fake'

initFolder()

export interface IChatUserInfo {
  userId: string
  name: string
}

databaseServices.connect().then(() => {
  databaseServices.indexUsers()
  databaseServices.indexRefreshTokens()
  databaseServices.indexHashtags()
  databaseServices.indexSearchTweet()
})
const app = express()
app.use(cors())

const httpServer = createServer(app)
createIOSocket(httpServer)

app.use(express.json())

app.use('/users', usersRouter)
app.use('/medias', mediasRoute)
app.use('/tweets', tweetsRouter)
app.use('/bookmarks', bookmarksRouter)
app.use('/likes', likesRouter)
app.use('/search', searchRouter)
app.use('/static', staticRoute)
app.use('/conversations', conversationsRouter)

app.use(defaultErrorHandler)
console.log('port', envConfig.PORT)

httpServer.listen(envConfig.PORT)
