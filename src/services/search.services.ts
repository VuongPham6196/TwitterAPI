import { config } from 'dotenv'
import databaseServices from './database.services'
import { ObjectId } from 'mongodb'
import { Tweet } from '~/models/schemas/Tweet.schema'
import { getSearchByTweetContentAggerate } from '~/aggerates/search.aggerate'
import tweetServices from './tweet.services'

config()

export interface ISearchParams {
  user_id: ObjectId
  content: string
  page_size: number
  page_number: number
}

class SearchSevices {
  async search(params: ISearchParams) {
    const aggerate = getSearchByTweetContentAggerate(params)
    const [data, countData] = await Promise.all([
      databaseServices.tweets.aggregate<Tweet>(aggerate).toArray(),
      databaseServices.tweets.aggregate(aggerate.slice(0, 4)).toArray()
    ])
    const ids = data.map((item) => item._id as ObjectId)
    const updateDate = tweetServices.increaseViewForMany(ids)
    data.forEach((tweet) => {
      ;(tweet.updated_at = updateDate), tweet.user_views++
    })

    return {
      page_number: params.page_number,
      total: countData.length,
      page_size: params.page_size,
      total_pages: Math.ceil(countData.length / params.page_size),
      data
    }
  }
}

const searchServices = new SearchSevices()

export default searchServices
