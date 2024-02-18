import { ObjectId } from 'mongodb'
import { Media } from '../Others'
import { TweetAudience, TweetType } from '~/constants/enums'

export interface ITweet {
  _id?: ObjectId
  user_id: ObjectId
  type: TweetType
  audience: TweetAudience
  content: string
  parent_id: null | ObjectId
  hastags: ObjectId[]
  mentions: ObjectId[]
  medias: Media[]
  guest_views: number
  user_views: number
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
  hastags: ObjectId[]
  mentions: ObjectId[]
  medias: Media[]
  guest_views: number
  user_views: number
  created_at: Date
  updated_at: Date

  constructor(tweet: ITweet) {
    const date = new Date()

    this.user_id = tweet.user_id
    this.type = tweet.type
    this.audience = tweet.audience
    this.content = tweet.content
    this.parent_id = tweet.parent_id
    this.hastags = tweet.hastags
    this.mentions = tweet.mentions
    this.medias = tweet.medias
    this.guest_views = tweet.guest_views
    this.user_views = tweet.user_views
    this.created_at = tweet.created_at || date
    this.updated_at = tweet.updated_at || date
  }
}
