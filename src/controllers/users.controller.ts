import { NextFunction, Request, Response } from 'express'
import { RegisterReqBody } from '~/models/requests/User.requests'
import { ParamsDictionary } from 'express-serve-static-core'
import usersServices from '~/services/users.services'
import { USER_MESSAGES } from '~/constants/messages'
import { ObjectId } from 'mongodb'
import User from '~/models/schemas/User.schema'
import HTTP_STATUS from '~/constants/httpStatus'

export const loginController = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as User
  const _id = user._id as ObjectId

  const result = await usersServices.login(_id)
  if (!result) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: USER_MESSAGES.LOGIN_FAILED })
  }
  res.status(HTTP_STATUS.OK).json({ message: USER_MESSAGES.LOGIN_SUCCESSFUL, result })
}

export const registerController = async (
  req: Request<ParamsDictionary, any, RegisterReqBody>,
  res: Response,
  next: NextFunction
) => {
  const result = await usersServices.registerUser(req.body)
  res.status(HTTP_STATUS.OK).json({ message: USER_MESSAGES.REGISTER_SUCCESSFUL, result })
}
