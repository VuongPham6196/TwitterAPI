import { Request } from 'express'
import { ParamSchema } from 'express-validator'
import { JsonWebTokenError } from 'jsonwebtoken'
import { ObjectId } from 'mongodb'
import HTTP_STATUS from '~/constants/httpStatus'
import { USER_MESSAGES } from '~/constants/messages'
import { ErrorWithStatus } from '~/models/schemas/Errors'
import databaseServices from '~/services/database.services'
import usersServices from '~/services/users.services'
import { hashPassword } from '~/utils/crypto'
import { verifyToken } from '~/utils/jwt'

export const AuthorizationSchema: ParamSchema = {
  custom: {
    options: async (value, { req }) => {
      try {
        const token = value.split(' ')[1]
        if (!token) {
          throw new ErrorWithStatus({
            message: USER_MESSAGES.ACCESS_TOKEN_IS_INVALID,
            status: HTTP_STATUS.UNAUTHORIZED
          })
        }
        const result = await verifyToken({
          token: token,
          secretKey: process.env.JWT_ACCESS_TOKEN_SECRET as string
        })
        ;(req as Request).decoded_authorization = result
        return true
      } catch (error) {
        if (error instanceof JsonWebTokenError) {
          throw new ErrorWithStatus({
            message: USER_MESSAGES.ACCESS_TOKEN_IS_INVALID,
            status: HTTP_STATUS.UNAUTHORIZED
          })
        }
      }
    }
  }
}

export const RefreshTokenSchema: ParamSchema = {
  notEmpty: { errorMessage: USER_MESSAGES.REFRESH_TOKEN_IS_REQUIRED },
  custom: {
    options: async (value, { req }) => {
      try {
        const [refresh_token, decoded_refresh_token] = await Promise.all([
          databaseServices.refreshTokens.findOne({ refresh_token: value }),
          verifyToken({ token: value, secretKey: process.env.JWT_REFRESH_TOKEN_SECRET as string })
        ])
        if (!refresh_token) {
          throw new ErrorWithStatus({
            message: USER_MESSAGES.REFRESH_TOKEN_IS_NOT_EXIST,
            status: HTTP_STATUS.UNAUTHORIZED
          })
        }
        ;(req as Request).decoded_refresh_token = decoded_refresh_token
      } catch (error) {
        if (error instanceof JsonWebTokenError) {
          throw new ErrorWithStatus({
            message: USER_MESSAGES.REFRESH_TOKEN_IS_INVALID,
            status: HTTP_STATUS.UNAUTHORIZED
          })
        }
        throw error
      }
    }
  }
}

export const VerifyEmailTokenSchema: ParamSchema = {
  notEmpty: { errorMessage: USER_MESSAGES.VERIFY_EMAIL_TOKEN_IS_REQUIRED },
  custom: {
    options: async (value, { req }) => {
      try {
        const decoded_verify_email_token = await verifyToken({
          token: value,
          secretKey: process.env.JWT_VERIFY_EMAIL_TOKEN_SECRET as string
        })

        if (!decoded_verify_email_token) {
          throw new ErrorWithStatus({
            message: USER_MESSAGES.VERIFY_EMAIL_TOKEN_IS_INVALID,
            status: HTTP_STATUS.UNAUTHORIZED
          })
        }

        const user = await databaseServices.users.findOne({
          _id: new ObjectId(decoded_verify_email_token.user_id)
        })

        if (user?.email_verify_token !== value) {
          throw new ErrorWithStatus({
            message: USER_MESSAGES.VERIFY_EMAIL_TOKEN_IS_INVALID,
            status: HTTP_STATUS.UNAUTHORIZED
          })
        }

        ;(req as Request).decoded_verify_email_token = decoded_verify_email_token
      } catch (error) {
        if (error instanceof JsonWebTokenError) {
          throw new ErrorWithStatus({
            message: USER_MESSAGES.VERIFY_EMAIL_TOKEN_IS_INVALID,
            status: HTTP_STATUS.UNAUTHORIZED
          })
        }
        throw error
      }
    }
  }
}

export const LoginEmailSchema: ParamSchema = {
  isEmail: {
    errorMessage: USER_MESSAGES.EMAIL_MUST_BE_VALID
  },
  trim: true,
  custom: {
    options: async (value, { req }) => {
      const password = req.body.password
      const user = await databaseServices.users.findOne({ email: value, password: hashPassword(password) })
      if (!user) {
        throw new Error(USER_MESSAGES.EMAIL_OR_PASSWORD_INCORRECT)
      }

      ;(req as Request).user = user
      return true
    }
  }
}

export const LoginPasswordSchema: ParamSchema = {
  notEmpty: { errorMessage: USER_MESSAGES.PASSWORD_IS_REQUIRED },
  trim: true
}

export const RegisterEmailSchema: ParamSchema = {
  notEmpty: { errorMessage: USER_MESSAGES.EMAIL_IS_REQUIRED },
  isEmail: {
    errorMessage: USER_MESSAGES.EMAIL_MUST_BE_VALID
  },
  trim: true,
  custom: {
    options: async (value) => {
      const isExist = await usersServices.checkEmailExist(value)
      if (isExist) {
        throw new ErrorWithStatus({
          message: USER_MESSAGES.EMAIL_ALREADY_EXISTS,
          status: HTTP_STATUS.UNAUTHORIZED
        })
      }
      return true
    }
  }
}

export const UsernameSchema: ParamSchema = {
  notEmpty: {
    errorMessage: USER_MESSAGES.USERNAME_IS_REQUIRED
  },
  isString: {
    errorMessage: USER_MESSAGES.USERNAME_MUST_BE_STRING
  },
  isLength: {
    options: {
      min: 1,
      max: 100
    },
    errorMessage: USER_MESSAGES.USERNAME_MUST_BE_FROM_1_TO_100_CHARACTERS
  },
  trim: true
}

export const PasswordSchema: ParamSchema = {
  notEmpty: { errorMessage: USER_MESSAGES.PASSWORD_IS_REQUIRED },
  isString: { errorMessage: USER_MESSAGES.PASSWORD_MUST_BE_STRING },
  isLength: {
    options: {
      min: 6,
      max: 50
    },
    errorMessage: USER_MESSAGES.PASSWORD_MUST_BE_FROM_6_TO_50_CHARACTERS
  },
  trim: true,
  isStrongPassword: {
    options: { minLength: 6, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 },
    errorMessage: USER_MESSAGES.PASSWORD_MUST_BE_STRONG
  }
}

export const ConfirmPasswordSchema: ParamSchema = {
  notEmpty: { errorMessage: USER_MESSAGES.CONFIRM_PASSWORD_IS_REQUIRED },
  isString: { errorMessage: USER_MESSAGES.CONFIRM_PASSWORD_MUST_BE_STRING },
  isLength: {
    options: {
      min: 6,
      max: 50
    },
    errorMessage: USER_MESSAGES.CONFIRM_PASSWORD_MUST_BE_FROM_6_TO_50_CHARACTERS
  },
  trim: true,
  custom: {
    options: (value, { req }) => {
      if (value !== req.body.password) {
        throw new Error(USER_MESSAGES.PASSWORDS_DO_NOT_MATCH)
      }
      return true
    }
  }
}

export const DateOfBirthSchema: ParamSchema = {
  isISO8601: {
    options: { strict: true, strictSeparator: true },
    errorMessage: USER_MESSAGES.DATE_OF_BIRTH_MUST_BE_ISO_8601
  }
}

export const ForgotPasswordEmailSchema: ParamSchema = {
  notEmpty: { errorMessage: USER_MESSAGES.EMAIL_IS_REQUIRED },
  isEmail: {
    errorMessage: USER_MESSAGES.EMAIL_MUST_BE_VALID
  },
  trim: true,
  custom: {
    options: async (value, { req }) => {
      const user = await databaseServices.users.findOne({ email: value })
      if (!user) {
        throw new ErrorWithStatus({
          message: USER_MESSAGES.USERT_NOT_FOUND,
          status: HTTP_STATUS.UNAUTHORIZED
        })
      }
      ;(req as Request).user = user
      return true
    }
  }
}

export const ForgotPasswordTokenSchema: ParamSchema = {
  notEmpty: {
    errorMessage: USER_MESSAGES.FORGOT_PASSWORD_TOKEN_IS_REQUIRED
  },
  custom: {
    options: async (value, { req }) => {
      try {
        const decoded_forgot_password_token = await verifyToken({
          token: value,
          secretKey: process.env.JWT_FORGOT_PASSWORD_TOKEN_SECRET as string
        })
        if (!decoded_forgot_password_token) {
          throw new ErrorWithStatus({
            message: USER_MESSAGES.INVALID_FORGOT_PASSWORD_TOKEN,
            status: HTTP_STATUS.UNAUTHORIZED
          })
        }
        const user = await databaseServices.users.findOne({
          _id: new ObjectId(decoded_forgot_password_token.user_id)
        })
        if (!user) {
          throw new ErrorWithStatus({
            message: USER_MESSAGES.USERT_NOT_FOUND,
            status: HTTP_STATUS.UNAUTHORIZED
          })
        }
        if (user.forgot_password_token !== value) {
          throw new ErrorWithStatus({
            message: USER_MESSAGES.INVALID_FORGOT_PASSWORD_TOKEN,
            status: HTTP_STATUS.UNAUTHORIZED
          })
        }
        ;(req as Request).decoded_forgot_password_token = decoded_forgot_password_token
        return true
      } catch (error) {
        if (error instanceof JsonWebTokenError) {
          throw new ErrorWithStatus({
            message: USER_MESSAGES.INVALID_FORGOT_PASSWORD_TOKEN,
            status: HTTP_STATUS.UNAUTHORIZED
          })
        }
        throw error
      }
    }
  }
}

type generalStringSchema = {
  fieldName?: string
  required?: boolean
  minLength?: number
  maxLength?: number
}

export const generalStringSchema = ({
  fieldName = 'Field',
  required = false,
  minLength = 0,
  maxLength = 100
}: generalStringSchema): ParamSchema => {
  const schema: ParamSchema = {
    optional: !required,
    isString: {
      errorMessage: `${fieldName} must be string!`
    },
    notEmpty: required
      ? {
          errorMessage: `${fieldName} is required!`
        }
      : undefined,
    isLength: {
      options: {
        min: minLength,
        max: maxLength
      },
      errorMessage: `${fieldName} must be from ${minLength} to ${maxLength} characters!`
    },
    trim: true
  }
  return schema
}
