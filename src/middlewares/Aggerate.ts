import { Document, ObjectId } from 'mongodb'
import { TweetType } from '~/constants/enums'

interface IGetNewFeedsAggerateProps {
  user_id: ObjectId
  followed_user_ids: ObjectId[]
  page_number: number
  page_size: number
}

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

export const getNewFeedsAggerate = ({
  user_id,
  followed_user_ids,
  page_number,
  page_size
}: IGetNewFeedsAggerateProps): Document[] => [
  {
    $match: {
      user_id: {
        $in: followed_user_ids
      }
    }
  },
  {
    $lookup: {
      from: 'users',
      localField: 'user_id',
      foreignField: '_id',
      as: 'user'
    }
  },
  {
    $unwind: {
      path: '$user'
    }
  },
  {
    $match: {
      $or: [
        {
          audience: 0
        },
        {
          $and: [
            {
              audience: 1
            },
            {
              'user.tweet_circle': {
                $in: [user_id]
              }
            }
          ]
        }
      ]
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
      tweet_children: 0,
      'user.password': 0,
      'user.date_of_birth': 0,
      'user.email_verify_token': 0,
      'user.forgot_password_token': 0,
      'user.tweet_circle': 0
    }
  }
]
