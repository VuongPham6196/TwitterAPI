import express from 'express'
import usersRouter from './src/routes/users.routes'
import databaseServices from './src/services/database.services'
import defaultErrorHandler from './src/middlewares/errors.middlewares'

databaseServices.connect()
const app = express()
const port = 3000

app.use(express.json())

app.use('/users', usersRouter)

app.use(defaultErrorHandler)

app.listen(port)
