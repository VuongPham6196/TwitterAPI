import { NextFunction, Request, Response } from 'express'
import { checkExact, checkSchema } from 'express-validator'
import { JsonWebTokenError } from 'jsonwebtoken'
import { ObjectId } from 'mongodb'
import HTTP_STATUS from '~/constants/httpStatus'
import { USER_MESSAGES } from '~/constants/messages'
import { ErrorWithStatus } from '~/models/schemas/Errors'
import databaseServices from '~/services/database.services'
import { verifyToken } from '~/utils/jwt'
import { validate } from '~/utils/validation'
import {
  AuthorizationSchema,
  ConfirmPasswordSchema,
  ForgotPasswordEmailSchema,
  ForgotPasswordTokenSchema,
  LoginPasswordSchema,
  LoginEmailSchema,
  RefreshTokenSchema,
  DateOfBirthSchema,
  RegisterEmailSchema,
  PasswordSchema,
  UsernameSchema,
  VerifyEmailTokenSchema,
  generalStringSchema
} from './schemas'
import User from '~/models/schemas/User.schema'
import { UserVerifyStatus } from '~/constants/enums'
import { TokenPayload } from '~/models/requests/User.requests'

export const loginValidator = validate(
  checkSchema(
    {
      email: LoginEmailSchema,
      password: LoginPasswordSchema
    },
    ['body']
  )
)

export const registerValidator = validate(
  checkSchema(
    {
      username: UsernameSchema,
      email: RegisterEmailSchema,
      password: PasswordSchema,
      confirm_password: ConfirmPasswordSchema,
      date_of_birth: DateOfBirthSchema
    },
    ['body']
  )
)

export const accessTokenValidator = validate(
  checkSchema(
    {
      Authorization: AuthorizationSchema
    },
    ['headers']
  )
)

export const refreshTokenValidator = validate(
  checkSchema(
    {
      refresh_token: RefreshTokenSchema
    },
    ['body']
  )
)

export const verifyEmailTokenValidator = validate(
  checkSchema(
    {
      verify_email_token: VerifyEmailTokenSchema
    },
    ['body']
  )
)

export const forgotPasswordValidator = validate(
  checkSchema(
    {
      email: ForgotPasswordEmailSchema
    },
    ['body']
  )
)

export const verifiedForgotPasswordTokenValidator = validate(
  checkSchema(
    {
      forgot_password_token: ForgotPasswordTokenSchema
    },
    ['body']
  )
)

export const resetPasswordTokenValidator = validate(
  checkSchema(
    {
      forgot_password_token: ForgotPasswordTokenSchema,
      password: PasswordSchema,
      confirm_password: ConfirmPasswordSchema
    },
    ['body']
  )
)

export const verifiedUserValidator = async (req: Request, res: Response, next: NextFunction) => {
  const { verify } = req.decoded_authorization as TokenPayload
  if (verify !== UserVerifyStatus.Verified) {
    return next(new ErrorWithStatus({ message: USER_MESSAGES.USER_NOT_VERIFIED, status: HTTP_STATUS.FORBIDDEN }))
  }
  next()
}

export const updateMeValidator = validate(
  checkSchema(
    {
      name: generalStringSchema({ fieldName: 'name' }),
      bio: generalStringSchema({ fieldName: 'bio' }),
      location: generalStringSchema({ fieldName: 'location' }),
      website: generalStringSchema({ fieldName: 'website' }),
      avatar: generalStringSchema({ fieldName: 'avatar', maxLength: 300 }),
      cover_photo: generalStringSchema({ fieldName: 'cover phote url', maxLength: 300 }),
      date_of_birth: { ...DateOfBirthSchema, optional: true }
    },
    ['body']
  )
)
