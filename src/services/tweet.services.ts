import { config } from 'dotenv'
import { CreateTweetRequestBody } from '~/models/requests/Tweet.request'
import { Tweet } from '~/models/schemas/Tweet.schema'
import databaseServices from './database.services'
import Hashtag from '~/models/schemas/Hashtag.schema'
import { ObjectId } from 'mongodb'
import { TweetType } from '~/constants/enums'
import { getNewFeedsAggerate, getTweetChildrenAggerate } from '~/aggerates/tweets.aggerate'
import { IPaginationParams } from '~/models/requests/Common.request'
import userServices from './user.services'

export interface IGetTweetChildrenProps extends IPaginationParams {
  parent_id: ObjectId
  tweet_type: TweetType
}

export interface IGetNewFeedsProps extends IPaginationParams {
  user_id: ObjectId
}

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

  async increaseView(tweet_id: string, user_id?: string) {
    const inc = user_id ? { user_views: 1 } : { guest_views: 1 }

    const result = await databaseServices.tweets.findOneAndUpdate(
      { _id: new ObjectId(tweet_id) },
      {
        $inc: inc,
        $currentDate: { updated_at: true }
      },
      {
        returnDocument: 'after',
        projection: { _id: 0, user_views: 1, guest_views: 1, updated_at: 1 } as Partial<Record<keyof Tweet, number>>
      }
    )
    return result.value as Pick<Tweet, 'user_views' | 'guest_views'>
  }

  increaseViewForMany(tweet_ids: ObjectId[]) {
    const date = new Date()
    databaseServices.tweets.updateMany(
      {
        _id: {
          $in: tweet_ids
        }
      },
      {
        $set: {
          updated_at: date
        },
        $inc: {
          user_views: 1
        }
      }
    )
    return date
  }

  async getTweetChildren(props: IGetTweetChildrenProps) {
    const { page_number, page_size } = props
    const aggerate = getTweetChildrenAggerate(props)

    const [data, total] = await Promise.all([
      await databaseServices.tweets.aggregate<Tweet>(aggerate).toArray(),
      databaseServices.tweets.countDocuments(aggerate.at(0))
    ])

    const tweetIds = data.map((item) => item._id as ObjectId)
    const updateDate = this.increaseViewForMany(tweetIds)
    data.forEach((tweet) => {
      ;(tweet.updated_at = updateDate), tweet.user_views++
    })

    return { page_number, total, page_size, total_pages: Math.ceil(total / page_size), data }
  }

  async getNewFeeds(props: IGetNewFeedsProps) {
    const { user_id, page_number, page_size } = props
    const followedUserIds = (await userServices.getFollowedUsers(user_id)).result

    const aggerate = getNewFeedsAggerate({
      user_id,
      followed_user_ids: followedUserIds,
      page_number,
      page_size
    })

    const [data, countData] = await Promise.all([
      databaseServices.tweets.aggregate<Tweet>(aggerate).toArray(),
      (await databaseServices.tweets.aggregate([...aggerate.slice(0, 4), { $count: 'total' }]).toArray()).at(0)
    ])

    const tweetIds = data.map((item) => item._id as ObjectId)
    const updateDate = this.increaseViewForMany(tweetIds)
    data.forEach((tweet) => {
      ;(tweet.updated_at = updateDate), tweet.user_views++
    })
    const total = countData?.total ?? 0

    return {
      page_number,
      total,
      page_size,
      total_pages: Math.ceil(total / page_size),
      data
    }
  }
}

const tweetServices = new TweetServices()

export default tweetServices
