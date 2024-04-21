import { UPLOAD_IMAGE_TEMP_DIR, UPLOAD_IMAGE_DIR, UPLOAD_VIDEO_DIR } from './dir'
import { UserVerifyStatus, TokenType, TweetType, TweetAudience, MediaType } from './enums'
import HTTP_STATUS from './httpStatus'
import {
  GENERAL_MESSAGE,
  QUERY_PARAMS_MESSAGE,
  USER_MESSAGES,
  UPLOAD_MESSAGE,
  MEDIA_MESSAGE,
  TWEET_MESSAGE,
  BOOKMARK_MESSAGE,
  LIKE_MESSAGE,
  SEARCH_MESSAGE,
  EMAIL_MESSAGE,
  CONVERSATION_MESSAGE
} from './messages'
import { USERNAME_REGEX } from './regex'

class Constant {
  public readonly MAXIMUM_IMAGE_UPLOAD_FILE_LIMIT = 4
  public readonly MAXIMUM_IMAGE_UPLOAD_FILE_SIZE = 25 * 1024 * 1024 //25Mb
  public readonly MAXIMUM_VIDEO_UPLOAD_FILE_LIMIT = 2
  public readonly MAXIMUM_VIDEO_UPLOAD_FILE_SIZE = 100 * 1024 * 1024 //50Mb
  public readonly REGEXS = { USERNAME_REGEX }
  public readonly HTTP_STATUS = HTTP_STATUS
  public readonly DIRS = { UPLOAD_IMAGE_TEMP_DIR, UPLOAD_IMAGE_DIR, UPLOAD_VIDEO_DIR }
  public readonly MESSAGES = {
    GENERAL_MESSAGE,
    QUERY_PARAMS_MESSAGE,
    USER_MESSAGES,
    UPLOAD_MESSAGE,
    MEDIA_MESSAGE,
    TWEET_MESSAGE,
    BOOKMARK_MESSAGE,
    LIKE_MESSAGE,
    SEARCH_MESSAGE,
    EMAIL_MESSAGE,
    CONVERSATION_MESSAGE
  }
  public readonly ENUMS = { UserVerifyStatus, TokenType, TweetType, TweetAudience, MediaType }
}

const Constants = new Constant()
export default Constants
