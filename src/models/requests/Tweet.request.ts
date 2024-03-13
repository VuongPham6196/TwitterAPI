import { TweetAudience, TweetType } from '~/constants/enums'
import { Media } from '../Others'
import { Query, ParamsDictionary } from 'express-serve-static-core'

export type CreateTweetRequestBody = {
  type: TweetType
  parent_id: string | null
  content: string
  audience: TweetAudience
  hashtags: string[]
  mentions: string[]
  medias: Media[]
}

export interface ITweetRequestParams extends ParamsDictionary {
  tweet_id: string
}

export interface ITweetChildrenRequestQuery extends Query, ITweetPaginationRequestQuery {
  tweet_type: string
}

export interface ITweetPaginationRequestQuery extends Query {
  page_number: string
  page_size: string
}
