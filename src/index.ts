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
import { envConfig, isProduction } from './utils/config'
import swaggerUi from 'swagger-ui-express'

// import './utils/fake'

import swaggerJsdoc, { Options } from 'swagger-jsdoc'
import helmet from 'helmet'

const options: Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'VTwitter API Docs',
      version: '1.0.0'
    }
  },
  apis: ['./openapi/*.yaml']
}

const openapiSpecification = swaggerJsdoc(options)

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

// const file = fs.readFileSync(path.resolve('swagger.yml'), 'utf8')
// const swaggerDocument = YAML.parse(file)

const app = express()
app.use(helmet())
app.use(
  cors({
    origin: isProduction ? envConfig.CLIENT_URI : 'localhost*'
  })
)
const httpServer = createServer(app)
createIOSocket(httpServer)
app.use(express.json())
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification))
app.use('/users', usersRouter)
app.use('/tweets', tweetsRouter)
app.use('/medias', mediasRoute)
app.use('/bookmarks', bookmarksRouter)
app.use('/likes', likesRouter)
app.use('/search', searchRouter)
app.use('/static', staticRoute)
app.use('/conversations', conversationsRouter)
app.use(defaultErrorHandler)

httpServer.listen(envConfig.PORT)
