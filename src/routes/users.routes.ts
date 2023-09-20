import { Router } from 'express'
import { USER_MESSAGES } from '~/constants/messages'
import { loginController, logoutController, registerController } from '~/controllers/users.controller'
import {
  loginValidator,
  accessTokenValidator,
  refreshTokenValidator,
  registerValidator
} from '~/middlewares/users.middlewares'
import { WrapAsync } from '~/utils/handlers'
import { validate } from '~/utils/validation'

const usersRouter = Router()

/**
 * Description: Login a user
 * Path: /login
 * Method: POST
 * Body: {email: string, password: string}
 */

usersRouter.post('/login', loginValidator, WrapAsync(loginController))

/**
 * Description: Register a new user
 * Path: /register
 * Method: POST
 * Body: {name: srting, email: string, password: string, confirmPassword: string, date_of_birth: ISO8601}
 */
usersRouter.post('/register', registerValidator, WrapAsync(registerController))

/**
 * Description: Logout a user
 * Path: /logout
 * Method: POST
 * Body: {accessToken: string}
 */
usersRouter.post('/logout', accessTokenValidator, refreshTokenValidator, WrapAsync(logoutController))

export default usersRouter
