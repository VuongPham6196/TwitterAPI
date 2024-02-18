import { NextFunction, Request, Response } from 'express'
import {
  ForgotPassowrdReqBody,
  LogoutReqBody,
  RegisterReqBody,
  TokenPayload,
  VerifyEmailReqBody,
  ResetPasswordReqBody,
  VerifyForgotPassowrdReqBody,
  UpdateMeReqBody,
  GetUserProfileParams,
  FollowReqBody,
  UnfollowParams,
  ChangePasswordReqBody,
  RefreshTokenReqBody
} from '~/models/requests/User.requests'
import { ParamsDictionary } from 'express-serve-static-core'
import userServices from '~/services/user.services'
import { USER_MESSAGES } from '~/constants/messages'
import { ObjectId } from 'mongodb'
import User from '~/models/schemas/User.schema'
import HTTP_STATUS from '~/constants/httpStatus'
import databaseServices from '~/services/database.services'
import { UserVerifyStatus } from '~/constants/enums'

export const loginController = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as User
  const _id = user._id as ObjectId

  const result = await userServices.login({ user_id: _id.toString(), verify: user.verify })

  if (!result) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: USER_MESSAGES.LOGIN_FAILED })
  }

  //TODO:Client should check if user is verified or not
  if (user.verify === UserVerifyStatus.Banned) {
    return res.status(HTTP_STATUS.OK).json({ message: USER_MESSAGES.ACCOUNT_BANNED, result })
  }

  if (user.verify === UserVerifyStatus.Unverified) {
    return res.status(HTTP_STATUS.OK).json({ message: USER_MESSAGES.NOT_VERIFIED_EMAIL, result })
  }

  res.status(HTTP_STATUS.OK).json({ message: USER_MESSAGES.LOGIN_SUCCESSFUL, result })
}

export const refreshTokenController = async (
  req: Request<ParamsDictionary, any, RefreshTokenReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { refresh_token } = req.body
  const { user_id, verify, exp } = req.decoded_refresh_token as TokenPayload
  const result = await userServices.refreshToken({ old_refresh_token: refresh_token, user_id, verify, exp })
  return res.json({
    message: USER_MESSAGES.REFRESH_TOKEN_SUCCESS,
    result
  })
}

export const registerController = async (
  req: Request<ParamsDictionary, any, RegisterReqBody>,
  res: Response,
  next: NextFunction
) => {
  const result = await userServices.registerUser(req.body)
  res.status(HTTP_STATUS.OK).json({ message: USER_MESSAGES.REGISTER_SUCCESSFUL, result })
}

export const logoutController = async (
  req: Request<ParamsDictionary, any, LogoutReqBody>,
  res: Response,
  next: NextFunction
) => {
  const result = await userServices.logout(req.body.refresh_token)
  res.status(HTTP_STATUS.OK).json(result)
}

export const verifyEmailController = async (
  req: Request<ParamsDictionary, any, VerifyEmailReqBody>,
  res: Response,
  next: NextFunction
) => {
  const user_id = req.decoded_verify_email_token?.user_id as string
  const user = await databaseServices.users.findOne({ _id: new ObjectId(user_id) })

  if (!user) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: USER_MESSAGES.USERT_NOT_FOUND })
  }

  if (user.verify === UserVerifyStatus.Verified) {
    return res.status(HTTP_STATUS.OK).json({ message: USER_MESSAGES.ALREADY_VERIFIED_EMAIL_BEFORE })
  }

  if (user.verify === UserVerifyStatus.Banned) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: USER_MESSAGES.ACCOUNT_BANNED })
  }

  const result = await userServices.verifyEmail({ user_id, verify: UserVerifyStatus.Verified })
  res.status(HTTP_STATUS.OK).json({ message: USER_MESSAGES.VERIFY_EMAIL_SUCCESSFUL, result })
}

export const resendVerifyEmailController = async (req: Request, res: Response, next: NextFunction) => {
  const user_id = req.decoded_authorization?.user_id as string
  const user = await databaseServices.users.findOne({ _id: new ObjectId(user_id) })

  if (!user) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: USER_MESSAGES.USERT_NOT_FOUND })
  }
  if (user.verify === UserVerifyStatus.Verified) {
    return res.status(HTTP_STATUS.OK).json({ message: USER_MESSAGES.ALREADY_VERIFIED_EMAIL_BEFORE })
  }
  const result = await userServices.resendVerifyEmail({ user_id, verify: UserVerifyStatus.Unverified })
  return res.status(HTTP_STATUS.OK).json({ message: USER_MESSAGES.RESEND_VERIFY_EMAIL_SUCCESSFUL, result: result })
}

export const forgotPasswordController = async (
  req: Request<ParamsDictionary, any, ForgotPassowrdReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { _id, verify } = req.user as User
  await userServices.forgotPassword({ user_id: (_id as ObjectId).toString(), verify })
  res.status(HTTP_STATUS.OK).json({ message: USER_MESSAGES.CHECK_EMAIL_TO_RESET_PASSWORD })
}

export const verifyForgotPasswordController = async (
  req: Request<ParamsDictionary, any, VerifyForgotPassowrdReqBody>,
  res: Response,
  next: NextFunction
) => {
  const forgot_password_token = req.body.forgot_password_token
  res.status(HTTP_STATUS.OK).json({
    message: USER_MESSAGES.VERIFY_FORGOT_PASSWORD_TOKEN_SUCCESSFUL,
    forgot_password_token
  })
}

export const resetPasswordController = async (
  req: Request<ParamsDictionary, any, ResetPasswordReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { user_id } = req.decoded_forgot_password_token as TokenPayload

  const result = await userServices.resetPassword(user_id, req.body.password)
  res.status(HTTP_STATUS.OK).json(result)
}

export const getMeController = async (req: Request, res: Response, next: NextFunction) => {
  const { user_id } = req.decoded_authorization as TokenPayload

  const result = await userServices.getMe(user_id)

  res.status(HTTP_STATUS.OK).json({
    message: USER_MESSAGES.GET_ME_SUCCESSFUL,
    result
  })
}

export const getProfileController = async (req: Request<GetUserProfileParams>, res: Response, next: NextFunction) => {
  const { user_id } = req.params

  const result = await userServices.getProfile(user_id)

  res.status(HTTP_STATUS.OK).json({
    message: USER_MESSAGES.GET_PROFILE_SUCCESSFUL,
    result
  })
}

export const updateMeController = async (
  req: Request<ParamsDictionary, any, UpdateMeReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { user_id } = req.decoded_authorization as TokenPayload

  const result = await userServices.updateMe(user_id, req.body)

  res.status(HTTP_STATUS.OK).json({
    message: USER_MESSAGES.UPDATE_ME_SUCCESSFUL,
    result
  })
}

export const followController = async (
  req: Request<ParamsDictionary, any, FollowReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const { followed_user_id } = req.body

  const existFollow = await databaseServices.follows.findOne({
    user_id: new ObjectId(user_id),
    followed_user_id: new ObjectId(followed_user_id)
  })

  if (existFollow) {
    return res.status(HTTP_STATUS.OK).json({
      message: USER_MESSAGES.ALREADY_FOLLOWED
    })
  }

  const result = await userServices.follow(user_id, followed_user_id)
  res.status(HTTP_STATUS.OK).json({
    result
  })
}

export const unfollowController = async (req: Request<UnfollowParams>, res: Response, next: NextFunction) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const { followed_user_id } = req.params

  const existFollow = await databaseServices.follows.findOne({
    user_id: new ObjectId(user_id),
    followed_user_id: new ObjectId(followed_user_id)
  })

  if (!existFollow) {
    return res.status(HTTP_STATUS.OK).json({
      message: USER_MESSAGES.ALREADY_UNFOLLOWED
    })
  }
  const result = await userServices.unfollow(user_id, followed_user_id)
  res.status(HTTP_STATUS.OK).json({
    result
  })
}

export const changePasswordController = async (
  req: Request<ParamsDictionary, any, ChangePasswordReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { user_id } = req.decoded_authorization as TokenPayload

  const result = await userServices.changePassword(user_id, req.body.newPassword)
  res.status(HTTP_STATUS.OK).json({
    result
  })
}

export const oauthController = async (req: Request, res: Response, next: NextFunction) => {
  const { code } = req.query
  const { access_token, refresh_token, newUser, verify } = await userServices.oauth(code as string)
  const url = `${process.env.CLIENT_REDIRECT_CALLBACK_URI}?access_token=${access_token}&refresh_token=${refresh_token}&new_user=${newUser}&verify=${verify}`
  return res.redirect(url)
}
