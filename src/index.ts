import express from 'express'
import usersRouter from './routes/users.routes'
import databaseServices from './services/database.services'
import defaultErrorHandler from './middlewares/errors.middlewares'
import cors from 'cors'

databaseServices.connect()
const app = express()

const port = 4000
app.use(cors())

app.use(express.json())

app.use('/users', usersRouter)

app.use(defaultErrorHandler)

app.listen(port)
