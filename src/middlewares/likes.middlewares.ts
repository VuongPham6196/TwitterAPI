import { ParamSchema, checkSchema } from 'express-validator'
import { validate } from '~/utils/validation'
import { CreateLikeTweetIdSchema, DeleteLikeTweetIdSchema } from './likes.schema'
import { CreateLikeRequestBody, DeleteLikeRequestParams } from '~/models/requests/Like.request'

export const createLikeValidator = validate(
  checkSchema(
    {
      tweet_id: CreateLikeTweetIdSchema
    } as Record<keyof CreateLikeRequestBody, ParamSchema>,
    ['body']
  )
)

export const deleteLikeValidator = validate(
  checkSchema(
    {
      tweet_id: DeleteLikeTweetIdSchema
    } as Record<keyof DeleteLikeRequestParams, ParamSchema>,
    ['params']
  )
)
