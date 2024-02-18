import { NextFunction, Request, Response } from 'express'
import { CreateTweetRequestBody } from '~/models/requests/Tweet.request'
import { ParamsDictionary } from 'express-serve-static-core'

export const createTweetController = async (
  req: Request<ParamsDictionary, any, CreateTweetRequestBody>,
  res: Response,
  next: NextFunction
) => {
  res.json({ message: 'createTweetController', result: { user: req.decoded_authorization, info: req.body } })
}
