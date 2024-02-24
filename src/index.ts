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

initFolder()

databaseServices.connect().then(() => {
  databaseServices.indexUsers()
  databaseServices.indexRefreshTokens()
  databaseServices.indexHashtags()
})
const app = express()

const port = 4000
app.use(cors())

app.use(express.json())

app.use('/users', usersRouter)
app.use('/medias', mediasRoute)
app.use('/tweets', tweetsRouter)
app.use('/bookmarks', bookmarksRouter)
app.use('/likes', likesRouter)
app.use('/static', staticRoute)

app.use(defaultErrorHandler)

app.listen(port)
