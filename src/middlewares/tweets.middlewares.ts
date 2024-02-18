import { ParamSchema, checkSchema } from 'express-validator'
import { CreateTweetRequestBody } from '~/models/requests/Tweet.request'
import { validate } from '~/utils/validation'
import {
  AudienceSchema,
  ContentSchema,
  HastagSchema,
  MediaSchema,
  MentionSchema,
  ParentIdSchema,
  TypeSchema
} from './tweets.schemas'

export const createTweetValidator = validate(
  checkSchema(
    {
      type: TypeSchema,
      parent_id: ParentIdSchema,
      content: ContentSchema,
      hastags: HastagSchema,
      mentions: MentionSchema,
      audience: AudienceSchema,
      medias: MediaSchema
    } as Record<keyof CreateTweetRequestBody, ParamSchema>,
    ['body']
  )
)
