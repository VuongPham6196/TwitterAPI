import { ParamSchema, checkSchema } from 'express-validator'
import { validate } from '~/utils/validation'
import { CreateBookmarkRequestBody, DeleteBookmarkRequestParams } from '~/models/requests/Bookmark.request'
import { CreateBookmarkTweetIdSchema, DeleteBookmarkTweetIdSchema } from './bookmarks.schema'

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
      tweet_id: DeleteBookmarkTweetIdSchema
    } as Record<keyof DeleteBookmarkRequestParams, ParamSchema>,
    ['params']
  )
)
