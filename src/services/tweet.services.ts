import { config } from 'dotenv'
import { CreateTweetRequestBody } from '~/models/requests/Tweet.request'
import { Tweet } from '~/models/schemas/Tweet.schema'
import databaseServices from './database.services'
import Hashtag from '~/models/schemas/Hashtag.schema'
import { ObjectId } from 'mongodb'

config()

class TweetServices {
  async checkAndCreateHashtags(hashtags: string[]) {
    const result = await Promise.all(
      hashtags.map((item) =>
        databaseServices.hashtags.findOneAndUpdate(
          {
            name: item
          },
          { $setOnInsert: new Hashtag({ name: item }) },
          {
            upsert: true,
            returnDocument: 'after'
          }
        )
      )
    )
    return result.map((item) => item.value?._id as ObjectId)
  }

  async createTweet(user_id: string, createTweetReqBody: CreateTweetRequestBody) {
    const { hashtags } = createTweetReqBody
    const handledHashTags = await this.checkAndCreateHashtags(hashtags)
    const insertResult = await databaseServices.tweets.insertOne(
      new Tweet({
        user_id,
        ...createTweetReqBody,
        hashtags: handledHashTags
      })
    )
    const result = await databaseServices.tweets.findOne({ _id: insertResult.insertedId })
    return result
  }
}

const tweetServices = new TweetServices()

export default tweetServices
