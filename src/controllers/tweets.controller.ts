import { NextFunction, Request, Response } from 'express'
import {
  CreateTweetRequestBody,
  ITweetChildrenRequestQuery,
  ITweetRequestParams
} from '~/models/requests/Tweet.request'
import { ParamsDictionary } from 'express-serve-static-core'
import { TokenPayload } from '~/models/requests/User.requests'
import tweetServices from '~/services/tweet.services'
import { TWEET_MESSAGE } from '~/constants/messages'
import { ObjectId } from 'mongodb'
import { IPaginationRequestQuery } from '~/models/requests/Common.request'

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

export const getTweetDetailsController = async (
  req: Request<ITweetRequestParams, any, any>,
  res: Response,
  next: NextFunction
) => {
  const viewsResult = await tweetServices.increaseView(req.params.tweet_id, req.decoded_authorization?.user_id)

  res.json({
    message: TWEET_MESSAGE.GET_TWEET_SUCCESSFUL,
    result: { ...req.tweet, ...viewsResult }
  })
}

export const getTweetChildrenController = async (
  req: Request<ITweetRequestParams, any, any, ITweetChildrenRequestQuery>,
  res: Response,
  next: NextFunction
) => {
  const { page_number, page_size, tweet_type } = req.query

  const result = await tweetServices.getTweetChildren({
    parent_id: new ObjectId(req.params.tweet_id),
    page_number: Number(page_number),
    page_size: Number(page_size),
    tweet_type: Number(tweet_type)
  })
  res.json({
    message: TWEET_MESSAGE.GET_TWEET_CHILDREN_SUCCESSFUL,
    result
  })
}

export const getNewFeedsController = async (
  req: Request<ParamsDictionary, any, any, IPaginationRequestQuery>,
  res: Response,
  next: NextFunction
) => {
  const { page_number, page_size } = req.query

  const result = await tweetServices.getNewFeeds({
    user_id: new ObjectId(req.decoded_authorization?.user_id),
    page_number: Number(page_number),
    page_size: Number(page_size)
  })
  res.json({
    message: TWEET_MESSAGE.GET_NEW_FEEDS_SUCCESSFUL,
    result
  })
}
