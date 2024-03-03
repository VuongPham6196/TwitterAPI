import { NextFunction, Request, Response } from 'express'
import { CreateTweetRequestBody } from '~/models/requests/Tweet.request'
import { ParamsDictionary } from 'express-serve-static-core'
import { TokenPayload } from '~/models/requests/User.requests'
import tweetServices from '~/services/tweet.services'
import { TWEET_MESSAGE } from '~/constants/messages'

export const createTweetController = async (
  req: Request<ParamsDictionary, any, CreateTweetRequestBody>,
  res: Response,
  next: NextFunction
) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const result = await tweetServices.createTweet(user_id, req.body)
  res.json({
    message: TWEET_MESSAGE.CREATE_TWEET_SUCCESSFUL,
    result
  })
}

export const getTweetDetailsController = async (req: Request, res: Response, next: NextFunction) => {
  const viewsResult = await tweetServices.increaseView(req.tweet!._id!, req.decoded_authorization?.user_id)

  res.json({
    message: TWEET_MESSAGE.GET_TWEET_SUCCESSFUL,
    result: { ...req.tweet, ...viewsResult }
  })
}

export const getTweetChildrenController = async (req: Request, res: Response, next: NextFunction) => {
  const { page_number, page_size, tweet_type } = req.query

  const result = await tweetServices.getTweetChildren({
    parent_id: req.tweet!._id!,
    page_number: Number(page_number),
    page_size: Number(page_size),
    tweet_type: Number(tweet_type)
  })
  res.json({
    message: TWEET_MESSAGE.GET_TWEET_CHILDREN_SUCCESSFUL,
    result
  })
}
