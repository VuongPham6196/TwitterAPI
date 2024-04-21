import { Router } from 'express'
import { getConversationController } from '~/controllers/conversations.controller'
import { paginationValidator } from '~/middlewares/common.middelwares'
import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { WrapAsync } from '~/utils/handlers'

const conversationsRouter = Router()

/**
 * Description: get conversation
 * Path: /receiver/:receiver_id
 * Method: GET
 * Header: {Authorization: Bearer <access_token>}
 * Params:{receiver_id: string}
 * Query: {page_number: number, page_size: number}
 */
conversationsRouter.get(
  '/receiver/:receiver_id',
  accessTokenValidator,
  verifiedUserValidator,
  paginationValidator,
  WrapAsync(getConversationController)
)

export default conversationsRouter
