import { NextFunction, Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { TokenPayload } from '~/models/requests/User.requests'
import { LIKE_MESSAGE } from '~/constants/messages'
import { CreateBookmarkRequestBody, DeleteBookmarkRequestParams } from '~/models/requests/Bookmark.request'
import likeServices from '~/services/like.services'

export const createLikeController = async (
  req: Request<ParamsDictionary, any, CreateBookmarkRequestBody>,
  res: Response,
  next: NextFunction
) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const result = await likeServices.createLike(user_id, req.body.tweet_id)
  res.json({
    message: LIKE_MESSAGE.CREATE_LIKE_SUCCESSFUL,
    result
  })
}

export const deleteLikeController = async (
  req: Request<DeleteBookmarkRequestParams>,
  res: Response,
  next: NextFunction
) => {
  const { user_id } = req.decoded_authorization as TokenPayload

  await likeServices.deleteLike(user_id, req.params.tweet_id)
  res.json({
    message: LIKE_MESSAGE.DELETE_LIKE_SUCCESSFUL
  })
}
