import { NextFunction, Request, Response } from 'express'
import { RegisterReqBody } from '~/models/requests/User.requests'
import { ParamsDictionary } from 'express-serve-static-core'
import usersServices from '~/services/users.services'

export const loginController = async (req: Request, res: Response, next: NextFunction) => {
  const { username, password } = req.body

  const result = await usersServices.login({ username, password })
  if (!result) {
    return res.status(400).json({ message: 'Login failed' })
  }
  res.status(200).json({ message: 'Login successful', result })
}

export const registerController = async (
  req: Request<ParamsDictionary, any, RegisterReqBody>,
  res: Response,
  next: NextFunction
) => {
  const result = await usersServices.registerUser(req.body)
  res.status(200).json({ message: 'Register successful', result })
}
