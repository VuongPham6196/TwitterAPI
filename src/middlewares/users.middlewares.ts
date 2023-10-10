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
  LoginUsernameSchema,
  RefreshTokenSchema,
  RegisterDateOfBirthSchema,
  RegisterEmailSchema,
  PasswordSchema,
  RegisterUsernameSchema,
  VerifyEmailTokenSchema
} from './schemas'

export const loginValidator = validate(
  checkSchema(
    {
      email: LoginUsernameSchema,
      password: LoginPasswordSchema
    },
    ['body']
  )
)

export const registerValidator = validate(
  checkSchema(
    {
      username: RegisterUsernameSchema,
      email: RegisterEmailSchema,
      password: PasswordSchema,
      confirm_password: ConfirmPasswordSchema,
      date_of_birth: RegisterDateOfBirthSchema
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
