import { Document } from 'mongodb'
import { TweetType } from '~/constants/enums'

export const TweetDetailsAggerate: Document[] = [
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
]
