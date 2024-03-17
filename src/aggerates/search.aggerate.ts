import { ObjectId } from 'mongodb'
import { MediaType, TweetType } from '~/constants/enums'
import { ISearchParams } from '~/services/search.services'

export const getSearchByTweetContentAggerate = ({
  content,
  page_number,
  page_size,
  user_id,
  media_type,
  followed_user_ids
}: ISearchParams & { followed_user_ids: ObjectId[] }) => {
  const $match: any = {
    $text: {
      $search: content
    }
  }

  if (media_type === 'video') {
    $match['medias.type'] = MediaType.Video
  }

  if (media_type === 'image') {
    $match['medias.type'] = MediaType.Image
  }

  if (followed_user_ids.length > 0) {
    $match['user_id'] = {
      $in: followed_user_ids
    }
  }

  return [
    {
      $match
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
}
