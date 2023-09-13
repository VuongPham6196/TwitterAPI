import { NextFunction, Request, Response } from 'express'
import { checkSchema } from 'express-validator'
import HTTP_STATUS from '~/constants/httpStatus'
import { USER_MESSAGES } from '~/constants/messages'
import { ErrorWithStatus } from '~/models/schemas/Errors'
import databaseServices from '~/services/database.services'
import usersServices from '~/services/users.services'
import { hashPassword } from '~/utils/crypto'
import { validate } from '~/utils/validation'

export const loginValidator = validate(
  checkSchema({
    email: {
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
          req.user = user
          return true
        }
      }
    },
    password: {
      notEmpty: { errorMessage: USER_MESSAGES.PASSWORD_IS_REQUIRED },
      trim: true
    }
  })
)

export const registerValidator = validate(
  checkSchema({
    username: {
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
    },
    email: {
      notEmpty: { errorMessage: USER_MESSAGES.EMAIL_IS_REQUIRED },
      isEmail: {
        errorMessage: USER_MESSAGES.EMAIL_MUST_BE_VALID
      },
      trim: true,
      custom: {
        options: async (value) => {
          const isExist = await usersServices.checkEmailExist(value)
          if (isExist) {
            throw new ErrorWithStatus({ message: USER_MESSAGES.EMAIL_ALREADY_EXISTS, status: HTTP_STATUS.UNAUTHORIZED })
          }
          return true
        }
      }
    },
    password: {
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
    },
    confirm_password: {
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
    },
    date_of_birth: {
      isISO8601: {
        options: { strict: true, strictSeparator: true },
        errorMessage: USER_MESSAGES.DATE_OF_BIRTH_MUST_BE_ISO_8601
      }
    }
  })
)
