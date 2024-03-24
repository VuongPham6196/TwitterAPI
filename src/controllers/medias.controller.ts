import { NextFunction, Request, Response } from 'express'
import Constants from '~/constants'
import mediaServices from '~/services/media.services'

export const uploadImageController = async (req: Request, res: Response, next: NextFunction) => {
  const result = await mediaServices.uploadImageHandler(req)
  res.json({
    message: Constants.MESSAGES.UPLOAD_MESSAGE.UPLOAD_SUCCESSFUL,
    result
  })
}

export const uploadVideoController = async (req: Request, res: Response, next: NextFunction) => {
  const result = await mediaServices.uploadVideoHandler(req)
  res.json({
    message: Constants.MESSAGES.UPLOAD_MESSAGE.UPLOAD_SUCCESSFUL,
    result
  })
}

export const uploadHLSVideoController = async (req: Request, res: Response, next: NextFunction) => {
  const result = await mediaServices.uploadHLSVideoHandler(req)
  res.json({
    message: Constants.MESSAGES.UPLOAD_MESSAGE.UPLOAD_SUCCESSFUL,
    result
  })
}
