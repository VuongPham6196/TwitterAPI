import { NextFunction, Request, RequestHandler, Response } from 'express'

export const WrapAsync = (func: RequestHandler<any>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await func(req, res, next)
    } catch (error) {
      next(error)
    }
  }
}
