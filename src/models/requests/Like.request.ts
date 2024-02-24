import { ParamsDictionary } from 'express-serve-static-core'

export type CreateLikeRequestBody = {
  tweet_id: string
}

export interface DeleteLikeRequestParams extends ParamsDictionary {
  tweet_id: string
}
