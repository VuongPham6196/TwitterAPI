import { Query } from 'express-serve-static-core'

export interface IPaginationRequestQuery extends Query {
  page_number: string
  page_size: string
}

export interface IPaginationParams {
  page_number: number
  page_size: number
}
