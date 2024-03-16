import { Router } from 'express'
import {
  createTweetController,
  getNewFeedsController,
  getTweetChildrenController,
  getTweetDetailsController
} from '~/controllers/tweets.controller'
import { TweetDetailsAggerate } from '~/aggerates/tweets.aggerate'
import { ifLoggedInValidator } from '~/middlewares/common.middelwares'
import {
  createTweetValidator,
  tweetTypeValidator,
  audienceValidator,
  tweetIdValidatorWithAggerate,
  paginationValidator
} from '~/middlewares/tweets.middlewares'
import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { WrapAsync } from '~/utils/handlers'

const tweetsRouter = Router()

/**
 * Description: Create a tweet
 * Path: /
 * Method: POST
 * Header: {Authorization: Bearer <access_token>}
 * Body: TTweet
 */
tweetsRouter.post(
  '/',
  accessTokenValidator,
  verifiedUserValidator,
  createTweetValidator,
  WrapAsync(createTweetController)
)

/**
 * Description: Get tweet details
 * Path: /:tweet_id
 * Method: GET
 */
tweetsRouter.get(
  '/:tweet_id',
  ifLoggedInValidator(accessTokenValidator),
  ifLoggedInValidator(verifiedUserValidator),
  tweetIdValidatorWithAggerate({ pipeline: TweetDetailsAggerate }),
  audienceValidator,
  WrapAsync(getTweetDetailsController)
)

/**
 * Description: Get tweet children
 * Path: /:tweet_id
 * Method: GET
 * Query:{tweet_type: TweetType, page_number: number, page_size: number}
 */
tweetsRouter.get(
  '/:tweet_id/children',
  accessTokenValidator,
  verifiedUserValidator,
  tweetIdValidatorWithAggerate(),
  audienceValidator,
  tweetTypeValidator,
  paginationValidator,
  WrapAsync(getTweetChildrenController)
)

/**
 * Description: Get new feed
 * Path: /:tweet_id
 * Method: GET
 * Header: {Authorization: Bearer <access_token>}
 * Query:{page_number: number, page_size: number}
 */
tweetsRouter.get(
  '/',
  accessTokenValidator,
  verifiedUserValidator,
  paginationValidator,
  WrapAsync(getNewFeedsController)
)

export default tweetsRouter
