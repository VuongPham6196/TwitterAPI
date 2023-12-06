import { ObjectId } from 'mongodb'

export interface FollowType {
  _id?: ObjectId
  user_id: ObjectId
  followed_user_id: ObjectId
}

export default class Follow {
  _id?: ObjectId
  user_id: ObjectId
  followed_user_id: ObjectId
  created_at?: Date

  constructor(follow: FollowType) {
    this._id = follow._id
    this.user_id = follow.user_id
    this.followed_user_id = follow.followed_user_id
    this.created_at = new Date()
  }
}
