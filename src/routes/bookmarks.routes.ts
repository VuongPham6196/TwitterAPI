import { Router } from 'express'
import { createBookmarkController, deleteBookmarkController } from '~/controllers/bookmarks.controller'
import { createBookmarkValidator, deleteBookmarkValidator } from '~/middlewares/bookmarks.middlewares'
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
  createBookmarkValidator,
  WrapAsync(createBookmarkController)
)

/**
 * Description: Create a bookmark
 * Path: /
 * Method: DELETE
 * Header: {Authorization: Bearer <access_token>}
 * Body: IBookmark
 */
bookmarksRouter.delete(
  '/',
  accessTokenValidator,
  verifiedUserValidator,
  deleteBookmarkValidator,
  WrapAsync(deleteBookmarkController)
)

export default bookmarksRouter
