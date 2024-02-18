import { ITweet } from '../schemas/Tweet.schema'

export type CreateTweetRequestBody = Pick<
  ITweet,
  'audience' | 'content' | 'hastags' | 'mentions' | 'medias' | 'parent_id' | 'type'
>
