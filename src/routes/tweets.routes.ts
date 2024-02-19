import { Router } from 'express'
import { createTweetController } from '~/controllers/tweets.controller'
import { createTweetValidator } from '~/middlewares/tweets.middlewares'
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

export default tweetsRouter
