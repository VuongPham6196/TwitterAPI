import { NextFunction, Request, Response } from 'express'
import { checkSchema } from 'express-validator'
import { ErrorWithStatus } from '~/models/schemas/Errors'
import usersServices from '~/services/users.services'
import { validate } from '~/utils/validation'

export const loginValidator = (req: Request, res: Response, next: NextFunction) => {
  const { username, password } = req.body
  if (!username || !password) {
    return res.status(400).json({
      message: 'Username and password are required'
    })
  }
  next()
}

export const registerValidator = validate(
  checkSchema({
    username: {
      notEmpty: true,
      isString: true,
      isLength: {
        options: {
          min: 1,
          max: 100
        }
      },
      errorMessage: 'Username must be a string',
      trim: true
    },
    email: {
      isEmail: true,
      errorMessage: 'Email must be a valid email',
      trim: true,
      custom: {
        options: async (value) => {
          const isExist = await usersServices.checkEmailExist(value)
          if (isExist) {
            throw new ErrorWithStatus({ message: 'Email already exists', status: 401 })
          }
          return true
        }
      }
    },
    password: {
      notEmpty: true,
      isString: true,
      errorMessage:
        'Password must be at least 6 characters and contain at least one lowercase letter, one uppercase letter, one number and one symbol',
      isLength: {
        options: {
          min: 6,
          max: 50
        }
      },
      trim: true,
      isStrongPassword: { options: { minLength: 6, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 } }
    },
    confirm_password: {
      notEmpty: true,
      isString: true,
      errorMessage:
        'Password must be at least 6 characters and contain at least one lowercase letter, one uppercase letter, one number and one symbol',
      isLength: {
        options: {
          min: 6,
          max: 50
        }
      },
      trim: true,
      custom: {
        options: (value, { req }) => {
          if (value !== req.body.password) {
            throw new Error('Passwords do not match')
          }
          return true
        }
      }
    },
    date_of_birth: {
      errorMessage: 'Date of birth must be a valid date',
      isISO8601: { options: { strict: true, strictSeparator: true } }
    }
  })
)
