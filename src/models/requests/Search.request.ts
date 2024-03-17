import { IPaginationRequestQuery } from './Common.request'

export interface ISearchRequestQuery extends IPaginationRequestQuery {
  content: string
  media_type: string
  people_follow: string
}
