import { Request } from 'express'
import { ParamSchema } from 'express-validator'
import { isEmpty, isString } from 'lodash'
import { ObjectId } from 'mongodb'
import { MediaType, TweetAudience, TweetType, UserVerifyStatus } from '~/constants/enums'
import HTTP_STATUS from '~/constants/httpStatus'
import { TWEET_MESSAGE } from '~/constants/messages'
import { ErrorWithStatus } from '~/models/Errors'
import { CreateTweetRequestBody } from '~/models/requests/Tweet.request'
import databaseServices from '~/services/database.services'
import { enumToNumberArray } from '~/utils/general'

export const TweetIdSchema: ParamSchema = {
  isMongoId: {
    errorMessage: TWEET_MESSAGE.IVALID_TWEET_ID
  },
  custom: {
    options: async (value, { req }) => {
      const existingTweet = await databaseServices.tweets.findOne({ _id: new ObjectId(value) })
      if (!existingTweet) {
        throw new ErrorWithStatus({ message: TWEET_MESSAGE.TWEET_NOT_FOUND, status: HTTP_STATUS.NOT_FOUND })
      }
      ;(req as Request).tweet = existingTweet
      return true
    }
  }
}

export const TypeSchema: ParamSchema = {
  isIn: {
    options: [enumToNumberArray(TweetType)],
    errorMessage: TWEET_MESSAGE.INVALID_TYPE
  }
}

export const ContentSchema: ParamSchema = {
  isString: true,
  custom: {
    options: async (value, { req }) => {
      const { type, hashtags, mentions } = req.body as CreateTweetRequestBody
      if (type !== TweetType.Retweet && isEmpty(hashtags) && isEmpty(mentions) && isEmpty(value)) {
        throw new Error(TWEET_MESSAGE.CONTENT_IS_REQUIRED)
      }
      return true
    }
  }
}

export const ParentIdSchema: ParamSchema = {
  custom: {
    options: async (value, { req }) => {
      const { type } = req.body as CreateTweetRequestBody
      if (type !== TweetType.Tweet && !ObjectId.isValid(value)) {
        throw new Error(TWEET_MESSAGE.INVALID_PARENT_ID)
      }
      if (type === TweetType.Tweet && value !== null) {
        throw new Error(TWEET_MESSAGE.PARENT_ID_MUST_BE_NULL)
      }
      return true
    }
  }
}

export const AudienceSchema: ParamSchema = {
  isIn: {
    options: [enumToNumberArray(TweetAudience)],
    errorMessage: TWEET_MESSAGE.INVALID_AUDIENCE
  }
}

export const HashtagSchema: ParamSchema = {
  isArray: true,
  custom: {
    options: async (value) => {
      if (value.some((hastag: any) => typeof hastag !== 'string')) {
        throw new Error(TWEET_MESSAGE.HASHTAGS_MUST_BE_ARRAY_OF_STRING)
      }
      return true
    }
  }
}

export const MentionSchema: ParamSchema = {
  isArray: true,
  custom: {
    options: async (value) => {
      if (value.some((userId: any) => !ObjectId.isValid(userId))) {
        throw new Error(TWEET_MESSAGE.MENTIONS_MUST_BE_ARRAY_OF_OBJECTID)
      }
      return true
    }
  }
}

export const MediaSchema: ParamSchema = {
  isArray: true,
  custom: {
    options: async (value) => {
      if (
        value.some(
          (item: any) =>
            isEmpty(item?.url) || !isString(item?.url) || !enumToNumberArray(MediaType).includes(item?.type)
        )
      ) {
        throw new Error(TWEET_MESSAGE.MEDIAS_MUST_BE_ARRAY_OF_MEDIA_OBJECT)
      }
      return true
    }
  }
}

export const GetTweetDetailsTweetIdSchema: ParamSchema = {
  isMongoId: {
    errorMessage: TWEET_MESSAGE.IVALID_TWEET_ID
  },
  custom: {
    options: async (_, { req }) => {
      const { tweet, decoded_authorization } = req as Request
      const user_id = decoded_authorization?.user_id
      console.log(user_id)

      const author = await databaseServices.users.findOne({ _id: tweet?.user_id })

      if (author?.verify === UserVerifyStatus.Banned) {
        throw new ErrorWithStatus({ status: HTTP_STATUS.NOT_FOUND, message: TWEET_MESSAGE.TWEET_NOT_FOUND })
      }

      if (tweet?.audience === TweetAudience.TwitterCircle) {
        if (
          !user_id ||
          (!author?.tweet_circle.some((item) => item.equals(user_id)) && !tweet?.user_id.equals(user_id))
        ) {
          throw new ErrorWithStatus({ status: HTTP_STATUS.FORBIDDEN, message: TWEET_MESSAGE.TWEET_IS_PRIVATE })
        }
      }
      return true
    }
  }
}
