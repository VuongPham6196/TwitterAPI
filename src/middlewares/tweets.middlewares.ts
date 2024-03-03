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
  PageNumberSchema,
  PageSizeSchema,
  ParentIdSchema,
  TypeSchema,
  getTweetIdSchemaByAggerate
} from './tweets.schemas'
import { AggregateOptions, Document } from 'mongodb'

export type TAggerateProps = {
  pipeline?: Document[] | undefined
  options?: AggregateOptions | undefined
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

export const getTweetDetailsValidator = validate(
  checkSchema(
    {
      tweet_id: GetTweetDetailsTweetIdSchema
    },
    ['params']
  )
)

export const getTweetChildrenValidator = validate(
  checkSchema(
    {
      tweet_type: TypeSchema,
      page_number: PageNumberSchema,
      page_size: PageSizeSchema
    },
    ['query']
  )
)
