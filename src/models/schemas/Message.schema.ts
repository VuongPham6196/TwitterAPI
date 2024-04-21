import { ObjectId } from 'mongodb'

export interface IMessage {
  _id?: ObjectId
  from: ObjectId
  to: ObjectId
  content: string
  created_at?: Date
  update_at?: Date
}

export default class Message {
  _id?: ObjectId
  from: ObjectId
  to: ObjectId
  content: string
  created_at?: Date
  update_at?: Date

  constructor(message: IMessage) {
    const { from, to, content, created_at, update_at } = message
    const date = new Date()
    this.content = content
    this.from = from
    this.to = to
    this.created_at = created_at || date
    this.update_at = update_at || date
  }
}
