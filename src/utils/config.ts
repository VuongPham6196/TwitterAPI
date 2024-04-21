import { config } from 'dotenv'
import argv from 'minimist'

export const isProduction = Boolean(argv(process.argv.slice(2)).production)

config({ path: isProduction ? '.env.prod' : '.env.dev' })

export const envConfig = {
  PORT: process.env.PORT as string,

  DB_USERNAME: process.env.DB_USERNAME as string,
  DB_PASSWORD: process.env.DB_PASSWORD as string,
  DB_NAME: process.env.DB_NAME as string,

  DB_USERS_COLLECTION: process.env.DB_USERS_COLLECTION as string,
  DB_REFRESH_TOKENS_COLLECTION: process.env.DB_REFRESH_TOKENS_COLLECTION as string,
  DB_FOLLOWS_COLLECTION: process.env.DB_FOLLOWS_COLLECTION as string,
  DB_TWEETS_COLLECTION: process.env.DB_TWEETS_COLLECTION as string,
  DB_HASHTAGS_COLLECTION: process.env.DB_HASHTAGS_COLLECTION as string,
  DB_BOOKMARKS_COLLECTION: process.env.DB_BOOKMARKS_COLLECTION as string,
  DB_LIKES_COLLECTION: process.env.DB_LIKES_COLLECTION as string,
  DB_CONVERSATIONS_COLLECTION: process.env.DB_CONVERSATIONS_COLLECTION as string,

  PASSWORD_SECRET: process.env.PASSWORD_SECRET as string,

  JWT_ACCESS_TOKEN_SECRET: process.env.JWT_ACCESS_TOKEN_SECRET as string,
  JWT_REFRESH_TOKEN_SECRET: process.env.JWT_REFRESH_TOKEN_SECRET as string,
  JWT_VERIFY_EMAIL_TOKEN_SECRET: process.env.JWT_VERIFY_EMAIL_TOKEN_SECRET as string,
  JWT_FORGOT_PASSWORD_TOKEN_SECRET: process.env.JWT_FORGOT_PASSWORD_TOKEN_SECRET as string,

  ACCESS_TOKEN_LIFE: process.env.ACCESS_TOKEN_LIFE as string,
  REFRESH_TOKEN_LIFE: process.env.REFRESH_TOKEN_LIFE as string,
  VERIFY_EMAIL_TOKEN_LIFE: process.env.VERIFY_EMAIL_TOKEN_LIFE as string,
  FORGOT_PASSWORD_TOKEN_LIFE: process.env.FORGOT_PASSWORD_TOKEN_LIFE as string,

  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID as string,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET as string,
  GOOGLE_REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI as string,

  CLIENT_REDIRECT_CALLBACK_URI: process.env.CLIENT_REDIRECT_CALLBACK_URI as string,
  CLIENT_URI: process.env.CLIENT_URI as string,

  AWS_REGION: process.env.AWS_REGION as string,
  AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY as string,
  AWS_SECRET_KEY: process.env.AWS_SECRET_KEY as string,
  AWS_REGISTER_EMAIL: process.env.AWS_REGISTER_EMAIL as string,
  AWS_S3_BUCKET_NAME: process.env.AWS_S3_BUCKET_NAME as string
}
