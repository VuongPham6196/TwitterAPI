import { config } from 'dotenv'
import { CreateTweetRequestBody } from '~/models/requests/Tweet.request'
import { Tweet } from '~/models/schemas/Tweet.schema'
import databaseServices from './database.services'

config()

class TweetServices {
  async createTweet(
    user_id: string,
    { type, parent_id, content, mentions, audience, hashtags, medias }: CreateTweetRequestBody
  ) {
    const insertResult = await databaseServices.tweets.insertOne(
      new Tweet({
        type,
        parent_id,
        audience,
        content,
        hashtags,
        medias,
        mentions,
        user_id
      })
    )
    const result = await databaseServices.tweets.findOne({ _id: insertResult.insertedId })
    return result
  }
}

const tweetsServices = new TweetServices()

export default tweetsServices
