import { config } from 'dotenv'
import { ObjectId } from 'mongodb'
import databaseServices from './database.services'
import Bookmark from '~/models/schemas/Bookmark.schema'

config()

class BookmarkServices {
  async createBookmark(userId: string, tweetId: string) {
    const user_id = new ObjectId(userId)
    const tweet_id = new ObjectId(tweetId)
    const bookmarkRes = await databaseServices.bookmarks.findOneAndUpdate(
      {
        user_id,
        tweet_id
      },
      { $setOnInsert: new Bookmark({ tweet_id, user_id }) },
      {
        upsert: true,
        returnDocument: 'after'
      }
    )
    return bookmarkRes.value
  }

  async deleteBookmark(bookmark_id: string) {
    await databaseServices.bookmarks.deleteOne({ _id: new ObjectId(bookmark_id) })
  }
}

const bookmarkServices = new BookmarkServices()

export default bookmarkServices
