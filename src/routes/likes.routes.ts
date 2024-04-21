import { Router } from 'express'
import { createLikeController, deleteLikeController } from '~/controllers/likes.controller'
import { tweetIdValidatorWithAggerate } from '~/middlewares/tweets.middlewares'
import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { WrapAsync } from '~/utils/handlers'

const likesRouter = Router()

/**
 * Description: Create a like
 * Path: /
 * Method: POST
 * Header: {Authorization: Bearer <access_token>}
 * Body: {tweet_id: string}
 */
likesRouter.post(
  '/',
  accessTokenValidator,
  verifiedUserValidator,
  tweetIdValidatorWithAggerate(),
  WrapAsync(createLikeController)
)

/**
 * Description: Delete a like
 * Path: /:tweet_id
 * Method: DELETE
 * Header: {Authorization: Bearer <access_token>}
 * Params: {tweet_id: string}
 */
likesRouter.delete(
  '/:tweet_id',
  accessTokenValidator,
  verifiedUserValidator,
  tweetIdValidatorWithAggerate(),
  WrapAsync(deleteLikeController)
)

export default likesRouter
