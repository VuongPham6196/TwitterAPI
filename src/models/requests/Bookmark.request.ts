import { ParamsDictionary } from 'express-serve-static-core'

export type CreateBookmarkRequestBody = {
  tweet_id: string
}

export interface DeleteBookmarkRequestParams extends ParamsDictionary {
  tweet_id: string
}
