import { config } from 'dotenv'
import { CreateTweetRequestBody } from '~/models/requests/Tweet.request'
import { Tweet } from '~/models/schemas/Tweet.schema'
import databaseServices from './database.services'
import Hashtag from '~/models/schemas/Hashtag.schema'
import { ObjectId } from 'mongodb'
import { TweetType } from '~/constants/enums'

export type GetTweetChildrenProps = {
  parent_id: ObjectId
  tweet_type: TweetType
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

  async increaseView(tweet_id: ObjectId, user_id?: string) {
    const inc = user_id ? { user_views: 1 } : { guest_views: 1 }

    const result = await databaseServices.tweets.findOneAndUpdate(
      { _id: tweet_id },
      {
        $inc: inc,
        $currentDate: { updated_at: true }
      },
      {
        returnDocument: 'after',
        projection: { _id: 0, user_views: 1, guest_views: 1 } as Partial<Record<keyof Tweet, number>>
      }
    )
    return result.value as Pick<Tweet, 'user_views' | 'guest_views'>
  }

  async getTweetChildren(props: GetTweetChildrenProps) {
    const { parent_id, page_number, page_size, tweet_type } = props
    const data = await databaseServices.tweets
      .aggregate<Tweet>([
        {
          $match: {
            parent_id,
            type: tweet_type
          }
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
        },
        {
          $skip: (page_number - 1) * page_size
        },
        {
          $limit: page_size
        }
      ])
      .toArray()

    const total = await databaseServices.tweets.countDocuments({ parent_id, type: tweet_type })

    return { page_number, total, total_pages: Math.ceil(total / page_size), data }
  }
}

const tweetServices = new TweetServices()

export default tweetServices
