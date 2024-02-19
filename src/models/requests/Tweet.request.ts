import { TweetAudience, TweetType } from '~/constants/enums'
import { Media } from '../Others'

export type CreateTweetRequestBody = {
  type: TweetType
  parent_id: string
  content: string
  audience: TweetAudience
  hashtags: string[]
  mentions: string[]
  medias: Media[]
}
