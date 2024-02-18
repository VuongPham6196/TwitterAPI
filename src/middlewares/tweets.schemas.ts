import { ParamSchema } from 'express-validator'
import { isEmpty } from 'lodash'
import { ObjectId } from 'mongodb'
import { MediaType, TweetAudience, TweetType } from '~/constants/enums'
import { TWEET_MESSAGE } from '~/constants/messages'
import { CreateTweetRequestBody } from '~/models/requests/Tweet.request'
import { enumToNumberArray } from '~/utils/general'

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
      const { type, hastags, mentions } = req.body as CreateTweetRequestBody
      if (type !== TweetType.Retweet && isEmpty(hastags) && isEmpty(mentions) && isEmpty(value)) {
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

export const HastagSchema: ParamSchema = {
  isArray: true,
  custom: {
    options: async (value) => {
      if (value.some((hastag: any) => typeof hastag !== 'string')) {
        throw new Error(TWEET_MESSAGE.HASTAGS_MUST_BE_ARRAY_OF_STRING)
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
        value.some((item: any) => typeof item?.url !== 'string' || !enumToNumberArray(MediaType).includes(item?.type))
      ) {
        throw new Error(TWEET_MESSAGE.MENTIONS_MUST_BE_ARRAY_OF_OBJECTID)
      }
      return true
    }
  }
}
