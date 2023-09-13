import { NextFunction, Request, RequestHandler, Response } from 'express'

export const WrapAsync = (func: RequestHandler) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Promise.resolve(func(req, res, next)).catch(next)
    try {
      await func(req, res, next)
    } catch (error) {
      next(error)
    }
  }
}
