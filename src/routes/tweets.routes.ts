import { Router } from 'express'
import {
  createTweetController,
  getTweetChildrenController,
  getTweetDetailsController
} from '~/controllers/tweets.controller'
import { TweetDetailsAggerate } from '~/middlewares/Aggerate'
import { ifLoggedInValidator } from '~/middlewares/common.middelwares'
import {
  createTweetValidator,
  getTweetChildrenValidator,
  getTweetDetailsValidator,
  tweetIdValidatorWithAggerate
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
  getTweetDetailsValidator,
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
  getTweetChildrenValidator,
  WrapAsync(getTweetChildrenController)
)

export default tweetsRouter
