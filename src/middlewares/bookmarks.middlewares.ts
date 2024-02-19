import { ParamSchema, checkSchema } from 'express-validator'
import { validate } from '~/utils/validation'
import { CreateBookmarkRequestBody, DeleteBookmarkRequestBody } from '~/models/requests/Bookmark.request'
import { CreateBookmarkTweetIdSchema, DeleteBookmarkIdSchema } from './bookmarks.schema'

export const createBookmarkValidator = validate(
  checkSchema(
    {
      tweet_id: CreateBookmarkTweetIdSchema
    } as Record<keyof CreateBookmarkRequestBody, ParamSchema>,
    ['body']
  )
)

export const deleteBookmarkValidator = validate(
  checkSchema(
    {
      bookmark_id: DeleteBookmarkIdSchema
    } as Record<keyof DeleteBookmarkRequestBody, ParamSchema>,
    ['body']
  )
)
