import { NextFunction, Request, Response } from 'express'
import { pick } from 'lodash'

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
