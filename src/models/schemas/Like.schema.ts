import { ObjectId } from 'mongodb'

export interface ILike {
  _id?: ObjectId
  tweet_id: ObjectId
  user_id: ObjectId
  created_at?: Date
}

export default class Like {
  _id?: ObjectId
  tweet_id: ObjectId
  user_id: ObjectId
  created_at: Date

  constructor(like: ILike) {
    const { tweet_id, user_id, created_at } = like
    this.user_id = user_id
    this.tweet_id = tweet_id
    this.created_at = created_at || new Date()
  }
}
