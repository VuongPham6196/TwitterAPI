import { ObjectId } from 'mongodb'
import { Media } from '../Others'
import { TweetAudience, TweetType } from '~/constants/enums'

export interface ITweet {
  _id?: ObjectId
  user_id: string
  type: TweetType
  audience: TweetAudience
  content: string
  parent_id: string | null
  hashtags: string[]
  mentions: string[]
  medias: Media[]
  guest_views?: number
  user_views?: number
  created_at?: Date
  updated_at?: Date
}

export class Tweet {
  _id?: ObjectId
  user_id: ObjectId
  type: TweetType
  audience: TweetAudience
  content: string
  parent_id: null | ObjectId
  hashtags: ObjectId[]
  mentions: ObjectId[]
  medias: Media[]
  guest_views: number
  user_views: number
  created_at: Date
  updated_at: Date

  constructor(tweet: ITweet) {
    const date = new Date()

    this.user_id = new ObjectId(tweet.user_id)
    this.type = tweet.type
    this.audience = tweet.audience
    this.content = tweet.content
    this.parent_id = tweet.parent_id ? new ObjectId(tweet.parent_id) : null
    this.hashtags = tweet.hashtags.map((item) => new ObjectId(item))
    this.mentions = tweet.mentions.map((item) => new ObjectId(item))
    this.medias = tweet.medias
    this.guest_views = tweet.guest_views ?? 0
    this.user_views = tweet.user_views ?? 0
    this.created_at = tweet.created_at ?? date
    this.updated_at = tweet.updated_at ?? date
  }
}
