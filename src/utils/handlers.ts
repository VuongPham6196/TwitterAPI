import { NextFunction, Request, RequestHandler, Response } from 'express'

export const WrapAsync = (func: RequestHandler<any, any, any, any>) => {
  return async (req: Request<any>, res: Response, next: NextFunction) => {
    try {
      await func(req, res, next)
    } catch (error) {
      next(error)
    }
  }
}
