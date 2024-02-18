import { config } from 'dotenv'
import { ITweet } from '~/models/schemas/Tweet.schema'

config()

class TweetServices {
  createTweet({ audience }: ITweet) {}
}

const usersServices = new TweetServices()

export default usersServices
