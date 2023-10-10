import { NextFunction, Request, Response } from 'express'
import {
  ForgotPassowrdReqBody,
  LogoutReqBody,
  RegisterReqBody,
  TokenPayload,
  VerifyEmailReqBody,
  resetPasswordReqBody,
  verifyForgotPassowrdReqBody
} from '~/models/requests/User.requests'
import { ParamsDictionary } from 'express-serve-static-core'
import usersServices from '~/services/users.services'
import { USER_MESSAGES } from '~/constants/messages'
import { ObjectId } from 'mongodb'
import User from '~/models/schemas/User.schema'
import HTTP_STATUS from '~/constants/httpStatus'
import databaseServices from '~/services/database.services'
import { UserVerifyStatus } from '~/constants/enums'

export const loginController = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as User
  const _id = user._id as ObjectId

  const result = await usersServices.login(_id)

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

export const registerController = async (
  req: Request<ParamsDictionary, any, RegisterReqBody>,
  res: Response,
  next: NextFunction
) => {
  const result = await usersServices.registerUser(req.body)
  res.status(HTTP_STATUS.OK).json({ message: USER_MESSAGES.REGISTER_SUCCESSFUL, result })
}

export const logoutController = async (
  req: Request<ParamsDictionary, any, LogoutReqBody>,
  res: Response,
  next: NextFunction
) => {
  const result = await usersServices.logout(req.body.refresh_token)
  res.status(HTTP_STATUS.OK).json(result)
}

export const verifyEmailController = async (
  req: Request<ParamsDictionary, any, VerifyEmailReqBody>,
  res: Response,
  next: NextFunction
) => {
  const _id = new ObjectId(req.decoded_verify_email_token?.user_id)
  const user = await databaseServices.users.findOne({ _id: _id })

  if (!user) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: USER_MESSAGES.USERT_NOT_FOUND })
  }

  if (user.verify === UserVerifyStatus.Verified) {
    return res.status(HTTP_STATUS.OK).json({ message: USER_MESSAGES.ALREADY_VERIFIED_EMAIL_BEFORE })
  }

  if (user.verify === UserVerifyStatus.Banned) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: USER_MESSAGES.ACCOUNT_BANNED })
  }

  const result = await usersServices.verifyEmail(_id)
  res.status(HTTP_STATUS.OK).json({ message: USER_MESSAGES.VERIFY_EMAIL_SUCCESSFUL, result })
}

export const resendVerifyEmailController = async (req: Request, res: Response, next: NextFunction) => {
  const user_id = new ObjectId(req.decoded_authorization?.user_id)
  const user = await databaseServices.users.findOne({ _id: user_id })

  if (!user) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: USER_MESSAGES.USERT_NOT_FOUND })
  }
  if (user.verify === UserVerifyStatus.Verified) {
    return res.status(HTTP_STATUS.OK).json({ message: USER_MESSAGES.ALREADY_VERIFIED_EMAIL_BEFORE })
  }
  const result = await usersServices.resendVerifyEmail(user_id)
  return res.status(HTTP_STATUS.OK).json({ message: USER_MESSAGES.RESEND_VERIFY_EMAIL_SUCCESSFUL, result: result })
}

export const forgotPasswordController = async (
  req: Request<ParamsDictionary, any, ForgotPassowrdReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { _id } = req.user as User
  await usersServices.forgotPassword((_id as ObjectId).toString())
  res.status(HTTP_STATUS.OK).json({ message: USER_MESSAGES.CHECK_EMAIL_TO_RESET_PASSWORD })
}

export const verifyForgotPasswordController = async (
  req: Request<ParamsDictionary, any, verifyForgotPassowrdReqBody>,
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
  req: Request<ParamsDictionary, any, resetPasswordReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { user_id } = req.decoded_forgot_password_token as TokenPayload

  const result = await usersServices.resetPassword(user_id, req.body.password)
  res.status(HTTP_STATUS.OK).json(result)
}
