import databaseServices from './database.services'
import { ObjectId } from 'mongodb'
import { Tweet } from '~/models/schemas/Tweet.schema'
import { getSearchByTweetContentAggerate } from '~/aggerates/search.aggerate'
import tweetServices from './tweet.services'
import { IPaginationParams } from '~/models/requests/Common.request'
import userServices from './user.services'

export interface ISearchParams extends IPaginationParams {
  user_id: ObjectId
  content: string
  media_type: string
  people_follow: string
}

class SearchSevices {
  async search(params: ISearchParams) {
    const { user_id, people_follow } = params
    let followedUserIds: ObjectId[] = []
    if (people_follow === 'true') {
      followedUserIds = (await userServices.getFollowedUsers(user_id)).result
    }

    const aggerate = getSearchByTweetContentAggerate({ ...params, followed_user_ids: followedUserIds })
    const [data, countData] = await Promise.all([
      databaseServices.tweets.aggregate<Tweet>(aggerate).toArray(),
      (await databaseServices.tweets.aggregate([...aggerate.slice(0, 4), { $count: 'total' }]).toArray()).at(0)
    ])
    const ids = data.map((item) => item._id as ObjectId)
    const updateDate = tweetServices.increaseViewForMany(ids)
    data.forEach((tweet) => {
      ;(tweet.updated_at = updateDate), tweet.user_views++
    })
    const total = countData?.total ?? 0

    return {
      page_number: params.page_number,
      total,
      page_size: params.page_size,
      total_pages: Math.ceil(total / params.page_size),
      data
    }
  }
}

const searchServices = new SearchSevices()

export default searchServices
