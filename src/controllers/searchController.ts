import { NextFunction, Request, Response } from 'express'
import { ObjectId } from 'mongodb'
import { ParamsDictionary } from 'express-serve-static-core'
import searchServices from '~/services/search.services'
import { SEARCH_MESSAGE } from '~/constants/messages'
import { ISearchRequestQuery } from '~/models/requests/Search.request'

export const searchController = async (
  req: Request<ParamsDictionary, any, any, ISearchRequestQuery>,
  res: Response,
  next: NextFunction
) => {
  const { page_number, page_size, content } = req.query

  const result = await searchServices.search({
    user_id: new ObjectId(req.decoded_authorization?.user_id),
    page_number: Number(page_number),
    page_size: Number(page_size),
    content
  })

  res.json({
    message: SEARCH_MESSAGE.SEARCH_SUCCESSFUL,
    result
  })
}
