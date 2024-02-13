import { ObjectId } from 'mongodb'

export interface RefreshTokenType {
  _id?: ObjectId
  user_id: ObjectId
  refresh_token: string
  created_at?: Date
  exp?: number
}

export default class RefreshToken {
  _id?: ObjectId
  user_id: ObjectId
  refresh_token: string
  created_at?: Date
  exp?: Date

  constructor(refreshToken: RefreshTokenType) {
    this._id = refreshToken._id
    this.user_id = refreshToken.user_id
    this.refresh_token = refreshToken.refresh_token
    this.created_at = new Date()
    if (refreshToken.exp) {
      this.exp = new Date(refreshToken.exp * 1000)
    }
  }
}
