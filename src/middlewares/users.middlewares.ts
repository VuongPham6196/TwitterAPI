import { NextFunction, Request, Response } from 'express'
import { ParamSchema, checkSchema } from 'express-validator'
import HTTP_STATUS from '~/constants/httpStatus'
import { USER_MESSAGES } from '~/constants/messages'
import { ErrorWithStatus } from '~/models/Errors'
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
  UserIdSchema,
  FollowUserIdSchema,
  OldPasswordSchema,
  TweetCircleSchema
} from './users.schemas'
import { UserVerifyStatus } from '~/constants/enums'
import {
  ChangePasswordReqBody,
  RegisterReqBody,
  ResetPasswordReqBody,
  TokenPayload,
  UpdateMeReqBody
} from '~/models/requests/User.requests'
import databaseServices from '~/services/database.services'
import { ObjectId } from 'mongodb'
import { USERNAME_REGEX } from '~/constants/regex'
import { generalStringSchema } from '~/utils/general'

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
    } as Record<keyof RegisterReqBody, ParamSchema>,
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
    } as Record<keyof ResetPasswordReqBody, ParamSchema>,
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
      date_of_birth: { ...DateOfBirthSchema, optional: true },
      username: generalStringSchema({
        fieldName: 'username',
        minLength: 4,
        maxLength: 15,
        additionalSchema: {
          custom: {
            options: async (value, { req }) => {
              if (!USERNAME_REGEX.test(value)) {
                throw new Error(USER_MESSAGES.USERNAME_INVALID)
              }
              const user = await databaseServices.users.findOne({
                username: value,
                _id: {
                  $ne: new ObjectId((req as Request).decoded_authorization?.user_id)
                }
              })
              if (user) {
                throw new Error(USER_MESSAGES.USERNAME_ALREADY_EXIST)
              }
              return true
            }
          }
        }
      }),
      tweet_circle: TweetCircleSchema
    } as Record<keyof UpdateMeReqBody, any>,
    ['body']
  )
)

export const userIdValidator = validate(
  checkSchema(
    {
      user_id: UserIdSchema
    },
    ['params']
  )
)

export const followValidator = validate(
  checkSchema(
    {
      followed_user_id: FollowUserIdSchema
    },
    ['body']
  )
)

export const unfollowValidator = validate(
  checkSchema(
    {
      followed_user_id: FollowUserIdSchema
    },
    ['params']
  )
)

export const changePasswordValidator = validate(
  checkSchema(
    {
      oldPassword: OldPasswordSchema,
      newPassword: PasswordSchema,
      confirmNewPassword: {
        ...ConfirmPasswordSchema,
        custom: {
          options: (value, { req }) => {
            if (value !== (req.body as ChangePasswordReqBody).newPassword) {
              throw new Error(USER_MESSAGES.PASSWORDS_DO_NOT_MATCH)
            }
            return true
          }
        }
      }
    } as Record<keyof ChangePasswordReqBody, ParamSchema>,
    ['body']
  )
)
