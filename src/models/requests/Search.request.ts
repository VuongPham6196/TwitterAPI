import { IPaginationRequestQuery } from './Common.request'

export interface ISearchRequestQuery extends IPaginationRequestQuery {
  content: string
}
