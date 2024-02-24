import { config } from 'dotenv'
import { ObjectId } from 'mongodb'
import databaseServices from './database.services'
import Like from '~/models/schemas/Like.schema'

config()

class LikeServices {
  async createLike(userId: string, tweetId: string) {
    const user_id = new ObjectId(userId)
    const tweet_id = new ObjectId(tweetId)
    const likeRes = await databaseServices.likes.findOneAndUpdate(
      {
        user_id,
        tweet_id
      },
      { $setOnInsert: new Like({ tweet_id, user_id }) },
      {
        upsert: true,
        returnDocument: 'after'
      }
    )
    return likeRes.value
  }

  async deleteLike(userId: string, tweetId: string) {
    const user_id = new ObjectId(userId)
    const tweet_id = new ObjectId(tweetId)
    await databaseServices.likes.findOneAndDelete({ user_id, tweet_id })
  }
}

const likeServices = new LikeServices()

export default likeServices
