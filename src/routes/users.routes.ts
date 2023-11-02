import { Router } from 'express'
import {
  forgotPasswordController,
  getMeController,
  loginController,
  logoutController,
  registerController,
  resendVerifyEmailController,
  resetPasswordController,
  updateMeController,
  verifyEmailController,
  verifyForgotPasswordController
} from '~/controllers/users.controller'
import {
  loginValidator,
  accessTokenValidator,
  refreshTokenValidator,
  registerValidator,
  verifyEmailTokenValidator,
  forgotPasswordValidator,
  verifiedForgotPasswordTokenValidator,
  resetPasswordTokenValidator,
  verifiedUserValidator,
  updateMeValidator
} from '~/middlewares/users.middlewares'
import { WrapAsync } from '~/utils/handlers'

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

/**
 * Description: Verify email token
 * Path: /verify-email
 * Method: POST
 * Body: {verifyEmailToken: string}
 */
usersRouter.post('/verify-email', verifyEmailTokenValidator, WrapAsync(verifyEmailController))

/**
 * Description: Verify email token
 * Path: /verify-email
 * Method: POST
 * Body: {verifyEmailToken: string}
 */
usersRouter.post('/resend-verify-email', accessTokenValidator, WrapAsync(resendVerifyEmailController))

/**
 * Description: Forgot password
 * Path: /forgot-password
 * Method: POST
 * Body: {email: string}
 */
usersRouter.post('/forgot-password', forgotPasswordValidator, WrapAsync(forgotPasswordController))

/**
 * Description: Verify Forgot Password
 * Path: /verify-forgot-password
 * Method: POST
 * Body: {token: string}
 */
usersRouter.post(
  '/verify-forgot-password',
  verifiedForgotPasswordTokenValidator,
  WrapAsync(verifyForgotPasswordController)
)

/**
 * Description: Reset Password
 * Path: /reset-password
 * Method: POST
 * Body: {token: string, password: string, confirmPassword: string}
 */
usersRouter.post('/reset-password', resetPasswordTokenValidator, WrapAsync(resetPasswordController))

/**
 * Description: Get Me
 * Path: /get-me
 * Method: GET
 */
usersRouter.get('/get-me', accessTokenValidator, WrapAsync(getMeController))

/**
 * Description: Update Me
 * Path: /update-me
 * Method: PATCH
 * Body: {name: string, bio: string, location: string, website: string, avatar: string, cover_photo: string}
 */
usersRouter.patch(
  '/update-me',
  accessTokenValidator,
  verifiedUserValidator,
  updateMeValidator,
  WrapAsync(updateMeController)
)

export default usersRouter
