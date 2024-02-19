import { Router } from 'express'
import {
  changePasswordController,
  followController,
  forgotPasswordController,
  getMeController,
  getProfileController,
  loginController,
  logoutController,
  oauthController,
  refreshTokenController,
  registerController,
  resendVerifyEmailController,
  resetPasswordController,
  unfollowController,
  updateMeController,
  verifyEmailController,
  verifyForgotPasswordController
} from '~/controllers/users.controller'
import { filterUpdateUserMiddleware } from '~/middlewares/common.middelwares'
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
  updateMeValidator,
  userIdValidator,
  followValidator,
  unfollowValidator,
  changePasswordValidator
} from '~/middlewares/users.middlewares'
import { UpdateMeReqBody } from '~/models/requests/User.requests'
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
 * Description: Refresh token
 * Path: /refresh-token
 * Method: POST
 * Body: {refreshToken: string}
 */
usersRouter.post('/refresh-token', refreshTokenValidator, WrapAsync(refreshTokenController))

/**
 * Description: Logout a user
 * Path: /logout
 * Method: POST
 * Header: {Authorization: Bearer <access_token>}
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
 * Header: {Authorization: Bearer <access_token>}
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
 * Header: {Authorization: Bearer <access_token>}
 */
usersRouter.get('/get-me', accessTokenValidator, WrapAsync(getMeController))

/**
 * Description: Get user profile
 * Path: /get-profile/:user-id
 * Method: GET
 */
usersRouter.get('/get-profile/:user_id', userIdValidator, WrapAsync(getProfileController))

/**
 * Description: Update Me
 * Path: /update-me
 * Method: PATCH
 * Header: {Authorization: Bearer <access_token>}
 * Body: {name: string, bio: string, location: string, website: string, avatar: string, cover_photo: string}
 */
usersRouter.patch(
  '/update-me',
  accessTokenValidator,
  verifiedUserValidator,
  updateMeValidator,
  filterUpdateUserMiddleware<UpdateMeReqBody>([
    'avatar',
    'bio',
    'cover_photo',
    'date_of_birth',
    'location',
    'name',
    'website',
    'username'
  ]),
  WrapAsync(updateMeController)
)

/**
 * Description: Follow
 * Path: /follow
 * Method: POST
 * Header: {Authorization: Bearer <access_token>}
 * Body: {followed_user_id: string}
 */
usersRouter.post('/follow', accessTokenValidator, verifiedUserValidator, followValidator, WrapAsync(followController))

/**
 * Description: Unfollow
 * Path: /follow:user_id
 * Method: DELETE
 * Header: {Authorization: Bearer <access_token>}
 * Body: {followed_user_id: string}
 */

usersRouter.delete(
  '/follow/:followed_user_id',
  accessTokenValidator,
  verifiedUserValidator,
  unfollowValidator,
  WrapAsync(unfollowController)
)

/**
 * Description: Change password
 * Path: /follow:user_id
 * Method: PUT
 * Header: {Authorization: Bearer <access_token>}
 * Body: {followed_user_id: string}
 */

usersRouter.put(
  '/change-password',
  accessTokenValidator,
  verifiedUserValidator,
  changePasswordValidator,
  WrapAsync(changePasswordController)
)

/**
 * Description: Oauth v2.0 Google
 * Path: /oauth/google
 * Method: GET
 */

usersRouter.get('/oauth/google', WrapAsync(oauthController))

export default usersRouter
