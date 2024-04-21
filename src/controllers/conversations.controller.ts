import { NextFunction, Request, Response } from 'express'
import { TokenPayload } from '~/models/requests/User.requests'
import { IConversationRequestParams } from '~/models/requests/Conversation.request'
import messageServices from '~/services/conversation.services'
import { IPaginationRequestQuery } from '~/models/requests/Common.request'
import Constants from '~/constants/constants'

export const getConversationController = async (
  req: Request<IConversationRequestParams, any, any, IPaginationRequestQuery>,
  res: Response,
  next: NextFunction
) => {
  const { page_number, page_size } = req.query

  const { user_id } = req.decoded_authorization as TokenPayload
  const result = await messageServices.getConversation({
    from: user_id,
    to: req.params.receiver_id,
    page_number: Number(page_number),
    page_size: Number(page_size)
  })

  res.json({
    message: Constants.MESSAGES.CONVERSATION_MESSAGE.GET_CONVERSATION_SUCCESSFUL,
    result
  })
}
