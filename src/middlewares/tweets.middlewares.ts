import { ParamSchema, checkSchema } from 'express-validator'
import { CreateTweetRequestBody } from '~/models/requests/Tweet.request'
import { validate } from '~/utils/validation'
import {
  AudienceSchema,
  ContentSchema,
  GetTweetDetailsTweetIdSchema,
  HashtagSchema,
  MediaSchema,
  MentionSchema,
  ParentIdSchema,
  TypeSchema,
  getTweetIdSchemaByAggerate
} from './tweets.schemas'
import { AggregateOptions, Document } from 'mongodb'
import { PageNumberSchema, PageSizeSchema } from './common.schemas'

export type TAggerateProps = {
  pipeline?: Document[]
  options?: AggregateOptions
}

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

export const tweetIdValidatorWithAggerate = (props?: TAggerateProps) =>
  validate(
    checkSchema(
      {
        tweet_id: getTweetIdSchemaByAggerate(props)
      },
      ['params', 'body']
    )
  )

export const audienceValidator = validate(
  checkSchema(
    {
      tweet_id: GetTweetDetailsTweetIdSchema
    },
    ['params']
  )
)

export const tweetTypeValidator = validate(
  checkSchema(
    {
      tweet_type: TypeSchema
    },
    ['query']
  )
)

export const paginationValidator = validate(
  checkSchema(
    {
      page_number: PageNumberSchema,
      page_size: PageSizeSchema
    },
    ['query']
  )
)
