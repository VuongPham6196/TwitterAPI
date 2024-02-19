import { ParamSchema } from 'express-validator'
import { ObjectId } from 'mongodb'
import HTTP_STATUS from '~/constants/httpStatus'
import { BOOKMARK_MESSAGE } from '~/constants/messages'
import { ErrorWithStatus } from '~/models/Errors'
import databaseServices from '~/services/database.services'

export const CreateBookmarkTweetIdSchema: ParamSchema = {
  custom: {
    options: async (value) => {
      const existingTweet = await databaseServices.tweets.findOne({ _id: new ObjectId(value) })
      if (!existingTweet) {
        throw new ErrorWithStatus({ message: BOOKMARK_MESSAGE.INVALID_TWEET_ID, status: HTTP_STATUS.BAD_REQUEST })
      }
      return true
    }
  }
}

export const DeleteBookmarkIdSchema: ParamSchema = {
  notEmpty: true,
  custom: {
    options: async (value) => {
      const existingBookmark = await databaseServices.bookmarks.findOne({ _id: new ObjectId(value) })
      if (!existingBookmark) {
        throw new ErrorWithStatus({ message: BOOKMARK_MESSAGE.BOOKMARK_NOT_EXIST, status: HTTP_STATUS.BAD_REQUEST })
      }
      return true
    }
  }
}
