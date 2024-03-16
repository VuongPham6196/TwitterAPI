import { config } from 'dotenv'
import { CreateTweetRequestBody } from '~/models/requests/Tweet.request'
import { Tweet } from '~/models/schemas/Tweet.schema'
import databaseServices from './database.services'
import Hashtag from '~/models/schemas/Hashtag.schema'
import { ObjectId } from 'mongodb'
import { TweetType } from '~/constants/enums'
import { getNewFeedsAggerate } from '~/aggerates/tweets.aggerate'

export interface IGetTweetChildrenProps {
  parent_id: ObjectId
  tweet_type: TweetType
  page_number: number
  page_size: number
}

export interface IGetNewFeedsProps {
  user_id: ObjectId
  page_number: number
  page_size: number
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
    const { parent_id, page_number, page_size, tweet_type } = props
    const [data, total] = await Promise.all([
      await databaseServices.tweets
        .aggregate<Tweet>([
          {
            $match: {
              parent_id: new ObjectId(parent_id),
              type: tweet_type
            }
          },
          {
            $skip: (page_number - 1) * page_size
          },
          {
            $limit: page_size
          },
          {
            $lookup: {
              from: 'bookmarks',
              localField: '_id',
              foreignField: 'tweet_id',
              as: 'bookmarks'
            }
          },
          {
            $lookup: {
              from: 'likes',
              localField: '_id',
              foreignField: 'tweet_id',
              as: 'likes'
            }
          },
          {
            $lookup: {
              from: 'tweets',
              localField: '_id',
              foreignField: 'parent_id',
              as: 'tweet_children'
            }
          },
          {
            $addFields: {
              bookmarks_coutn: {
                $size: '$bookmarks'
              },
              likes_coutn: {
                $size: '$likes'
              },
              retweet_count: {
                $size: {
                  $filter: {
                    input: '$tweet_children',
                    as: 'item',
                    cond: {
                      $eq: ['$$item.type', TweetType.Retweet]
                    }
                  }
                }
              },
              comment_count: {
                $size: {
                  $filter: {
                    input: '$tweet_children',
                    as: 'item',
                    cond: {
                      $eq: ['$$item.type', TweetType.Comment]
                    }
                  }
                }
              },
              quote_count: {
                $size: {
                  $filter: {
                    input: '$tweet_children',
                    as: 'item',
                    cond: {
                      $eq: ['$$item.type', TweetType.QuoteTweet]
                    }
                  }
                }
              }
            }
          },
          {
            $project: {
              tweet_children: 0
            }
          }
        ])
        .toArray(),
      databaseServices.tweets.countDocuments({ parent_id: new ObjectId(parent_id), type: tweet_type })
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
    const followedUsers = await databaseServices.follows.find({ user_id: new ObjectId(user_id) }).toArray()
    const followedUserIds = followedUsers.map((item) => item.followed_user_id)
    const aggerate = getNewFeedsAggerate({ user_id, followed_user_ids: followedUserIds, page_number, page_size })

    const [data, countData] = await Promise.all([
      databaseServices.tweets.aggregate<Tweet>(aggerate).toArray(),
      databaseServices.tweets.aggregate(aggerate.slice(0, 4)).toArray()
    ])

    const tweetIds = data.map((item) => item._id as ObjectId)
    const updateDate = this.increaseViewForMany(tweetIds)
    data.forEach((tweet) => {
      ;(tweet.updated_at = updateDate), tweet.user_views++
    })

    return {
      page_number,
      total: countData.length,
      page_size,
      total_pages: Math.ceil(countData.length / page_size),
      data
    }
  }
}

const tweetServices = new TweetServices()

export default tweetServices
