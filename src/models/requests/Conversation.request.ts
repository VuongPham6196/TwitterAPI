import { ParamsDictionary } from 'express-serve-static-core'

export interface IConversationRequestParams extends ParamsDictionary {
  receiver_id: string
}
