import { Router } from 'express'
import { createBookmarkController, deleteBookmarkController } from '~/controllers/bookmarks.controller'
import { tweetIdValidatorWithAggerate } from '~/middlewares/tweets.middlewares'
import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { WrapAsync } from '~/utils/handlers'

const bookmarksRouter = Router()

/**
 * Description: Create a bookmark
 * Path: /
 * Method: POST
 * Header: {Authorization: Bearer <access_token>}
 * Body: IBookmark
 */
bookmarksRouter.post(
  '/',
  accessTokenValidator,
  verifiedUserValidator,
  tweetIdValidatorWithAggerate(),
  WrapAsync(createBookmarkController)
)

/**
 * Description: Create a bookmark
 * Path: /:tweet_id
 * Method: DELETE
 * Header: {Authorization: Bearer <access_token>}
 */
bookmarksRouter.delete(
  '/:tweet_id',
  accessTokenValidator,
  verifiedUserValidator,
  tweetIdValidatorWithAggerate,
  WrapAsync(deleteBookmarkController)
)

export default bookmarksRouter
