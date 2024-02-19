import { ParamSchema, checkSchema } from 'express-validator'
import { CreateTweetRequestBody } from '~/models/requests/Tweet.request'
import { validate } from '~/utils/validation'
import {
  AudienceSchema,
  ContentSchema,
  HashtagSchema,
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
      hashtags: HashtagSchema,
      mentions: MentionSchema,
      audience: AudienceSchema,
      medias: MediaSchema
    } as Record<keyof CreateTweetRequestBody, ParamSchema>,
    ['body']
  )
)
