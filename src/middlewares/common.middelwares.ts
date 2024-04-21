import { NextFunction, Request, Response } from 'express'
import { checkSchema } from 'express-validator'
import { pick } from 'lodash'
import { validate } from '~/utils/validation'
import { PageNumberSchema, PageSizeSchema } from './common.schemas'

type FilterKeys<T> = Array<keyof T>

export const filterUpdateUserMiddleware =
  <T>(filterKeys: FilterKeys<T>) =>
  (req: Request, res: Response, next: NextFunction) => {
    req.body = pick(req.body, filterKeys)
    next()
  }

export const ifLoggedInValidator = (middlewareres: (req: Request, res: Response, next: NextFunction) => void) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.headers.authorization) {
      return middlewareres(req, res, next)
    }
    next()
  }
}

export const paginationValidator = validate(
  checkSchema(
    {
      page_number: PageNumberSchema,
      page_size: PageSizeSchema
    },
    ['query']
  )
)
