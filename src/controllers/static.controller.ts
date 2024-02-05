import { NextFunction, Request, Response } from 'express'
import path from 'path'
import { UPLOAD_IMAGE_DIR, UPLOAD_VIDEO_DIR } from '~/constants/dir'
import HTTP_STATUS from '~/constants/httpStatus'
import { MEDIA_MESSAGE, UPLOAD_MESSAGE } from '~/constants/messages'
import { ErrorWithStatus } from '~/models/Errors'

export const serveImageController = async (req: Request, res: Response, next: NextFunction) => {
  const { name } = req.params
  res.sendFile(path.resolve(UPLOAD_IMAGE_DIR, name), (err) => {
    if (err) {
      return next(new ErrorWithStatus({ message: UPLOAD_MESSAGE.NOT_FOUND, status: HTTP_STATUS.BAD_REQUEST }))
    }
  })
}

export const serveVideoController = async (req: Request, res: Response, next: NextFunction) => {
  const { name } = req.params
  res.sendFile(path.resolve(UPLOAD_VIDEO_DIR, name), (err) => {
    if (err) {
      return next(new ErrorWithStatus({ message: UPLOAD_MESSAGE.NOT_FOUND, status: HTTP_STATUS.BAD_REQUEST }))
    }
  })
}
