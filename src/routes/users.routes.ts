import { Router } from 'express'
import { loginController, registerController } from '~/controllers/users.controller'
import { loginValidator, registerValidator } from '~/middlewares/users.middlewares'
import { WrapAsync } from '~/utils/handlers'
import { validate } from '~/utils/validation'

const usersRouter = Router()

// define the about route
usersRouter.post('/login', loginValidator, WrapAsync(loginController))

/**
 * Description: Register a new user
 * Path: /register
 * Method: POST
 * Body: {name: srting, email: string, password: string, confirmPassword: string, date_of_birth: ISO8601}
 */
usersRouter.post('/register', registerValidator, WrapAsync(registerController))

export default usersRouter
