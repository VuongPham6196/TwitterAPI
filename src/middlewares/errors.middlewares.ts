import { NextFunction, Request, Response } from 'express'
import { omit } from 'lodash'
import HTTP_STATUS from '~/constants/httpStatus'
import { SERVER_MESSAGE } from '~/constants/messages'
import { ErrorWithStatus } from '~/models/Errors'

const defaultErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  try {
    if (err instanceof ErrorWithStatus) {
      return res.status(err.status).json(omit(err, 'status'))
    }
    if (!Object.getOwnPropertyDescriptor(err, 'configurable') || !Object.getOwnPropertyDescriptor(err, 'writable')) {
      return res.status(err.status || HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        message: err.message,
        errorInfo: err
      })
    }
    Object.getOwnPropertyNames(err).forEach((key) => {
      if (key !== 'stack') {
        Object.defineProperty(err, key, { enumerable: true })
      }
    })
    return res.status(err.status || HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: err.message,
      errorInfo: err
    })
  } catch (error) {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: SERVER_MESSAGE.INTERNAL_SERVER_ERROR,
      errorInfo: err
    })
  }
}

export default defaultErrorHandler
