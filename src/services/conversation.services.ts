import { ObjectId } from 'mongodb'
import databaseServices from './database.services'
import Message from '~/models/schemas/Message.schema'

type CreateMessage = { from: string; to: string; content: string; created_at: Date }

class MessageServices {
  async getConversation({
    from,
    to,
    page_number,
    page_size
  }: {
    from: string
    to: string
    page_number: number
    page_size: number
  }) {
    const fromId = new ObjectId(from)
    const toId = new ObjectId(to)
    const result = await databaseServices.messages
      .aggregate([
        {
          $match: {
            $or: [
              {
                from: fromId,
                to: toId
              },
              {
                from: toId,
                to: fromId
              }
            ]
          }
        },
        {
          $sort: {
            created_at: -1
          }
        },
        {
          $skip: (page_number - 1) * page_size
        },
        {
          $limit: page_size
        }
      ])
      .toArray()
    return result.reverse()
  }

  async createMessage({ from, to, content, created_at }: CreateMessage) {
    const message = new Message({
      from: new ObjectId(from),
      to: new ObjectId(to),
      content,
      created_at
    })
    const messageRes = await databaseServices.messages.insertOne(message)
    const insertedMessage = await databaseServices.messages.findOne({ _id: messageRes.insertedId })
    return insertedMessage as Message
  }

  async deleteMessage(message_id: string) {
    await databaseServices.bookmarks.findOneAndDelete({
      _id: new ObjectId(message_id)
    })
  }
}

const messageServices = new MessageServices()

export default messageServices
