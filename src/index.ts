import express, { NextFunction, Request, Response } from 'express'
import usersRouter from './routes/users.routes'
import databaseServices from './services/database.services'
import defaultErrorHandler from './middlewares/errors.middlewares'

databaseServices.connect()
const app = express()
const port = 3000

app.use(express.json())

app.use('/users', usersRouter)

app.use(defaultErrorHandler)

app.listen(port)
