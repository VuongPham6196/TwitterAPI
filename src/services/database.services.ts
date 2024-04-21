import { MongoClient, Db, Collection } from 'mongodb'
import { config } from 'dotenv'
import User from '~/models/schemas/User.schema'
import RefreshToken from '~/models/schemas/RefreshToken.schema'
import Follow from '~/models/schemas/Follow.schema'
import { Tweet } from '~/models/schemas/Tweet.schema'
import Hashtag from '~/models/schemas/Hashtag.schema'
import Bookmark from '~/models/schemas/Bookmark.schema'
import Like from '~/models/schemas/Like.schema'
import Message from '~/models/schemas/Message.schema'
import { envConfig } from '~/utils/config'
config()

const uri = `mongodb+srv://${envConfig.DB_USERNAME}:${envConfig.DB_PASSWORD}@v1.b170zpb.mongodb.net/?retryWrites=true&w=majority`

// Create a MongoClient with a MongoClientOptions object to set the Stable API version

class DatabaseServices {
  private client: MongoClient
  private db: Db
  constructor() {
    this.client = new MongoClient(uri)
    this.db = this.client.db(envConfig.DB_NAME)
  }
  async connect() {
    try {
      // Connect the client to the server	(optional starting in v4.7)
      await this.client.connect()
      // Send a ping to confirm a successful connection
      await this.db.command({ ping: 1 })
      console.log('Pinged your deployment. You successfully connected to MongoDB!')
    } catch (error) {
      console.error(error)
      this.client.close()
      throw new Error('Unable to connect to MongoDB Atlas')
    }
  }

  async indexUsers() {
    const exist = await this.users.indexExists(['username_1', 'email_1'])
    if (!exist) {
      this.users.createIndex(
        { username: 1 },
        {
          unique: true
        }
      )
      this.users.createIndex(
        { email: 1 },
        {
          unique: true
        }
      )
    }
  }

  async indexRefreshTokens() {
    const exist = await this.users.indexExists(['refresh_token_1', 'exp_1'])
    if (!exist) {
      this.refreshTokens.createIndex({ refresh_token: 1 })
      this.refreshTokens.createIndex(
        { exp: 1 },
        {
          expireAfterSeconds: 0
        }
      )
    }
  }

  async indexHashtags() {
    const exist = await this.hashtags.indexExists('name_1')
    if (!exist) {
      this.hashtags.createIndex({ name: 1 })
    }
  }

  async indexSearchTweet() {
    const exist = await this.tweets.indexExists('content_text')
    if (!exist) {
      this.tweets.createIndex({ content: 'text' }, { default_language: 'none' })
    }
  }

  get users(): Collection<User> {
    return this.db.collection(envConfig.DB_USERS_COLLECTION)
  }
  get refreshTokens(): Collection<RefreshToken> {
    return this.db.collection(envConfig.DB_REFRESH_TOKENS_COLLECTION)
  }
  get follows(): Collection<Follow> {
    return this.db.collection(envConfig.DB_FOLLOWS_COLLECTION)
  }
  get tweets(): Collection<Tweet> {
    return this.db.collection(envConfig.DB_TWEETS_COLLECTION)
  }
  get hashtags(): Collection<Hashtag> {
    return this.db.collection(envConfig.DB_HASHTAGS_COLLECTION)
  }
  get bookmarks(): Collection<Bookmark> {
    return this.db.collection(envConfig.DB_BOOKMARKS_COLLECTION)
  }
  get likes(): Collection<Like> {
    return this.db.collection(envConfig.DB_LIKES_COLLECTION)
  }
  get messages(): Collection<Message> {
    return this.db.collection(envConfig.DB_CONVERSATIONS_COLLECTION)
  }
}

const databaseServices = new DatabaseServices()

export default databaseServices
