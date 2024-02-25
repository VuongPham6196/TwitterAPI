import { Router } from 'express'
import { createTweetController, getTweetDetailsController } from '~/controllers/tweets.controller'
import { ifLoggedInValidator } from '~/middlewares/common.middelwares'
import { createTweetValidator, getTweetDetailsValidator, tweetIdValidator } from '~/middlewares/tweets.middlewares'
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
  tweetIdValidator,
  getTweetDetailsValidator,
  WrapAsync(getTweetDetailsController)
)

export default tweetsRouter
