import { NextFunction, Request, Response } from 'express'
import { UPLOAD_MESSAGE } from '~/constants/messages'
import mediasServices from '~/services/medias.services'

export const uploadImageController = async (req: Request, res: Response, next: NextFunction) => {
  const result = await mediasServices.uploadImageHandler(req)
  res.json({
    message: UPLOAD_MESSAGE.UPLOAD_SUCCESSFUL,
    result
  })
}

export const uploadVideoController = async (req: Request, res: Response, next: NextFunction) => {
  const result = await mediasServices.uploadVideoHandler(req)
  res.json({
    message: UPLOAD_MESSAGE.UPLOAD_SUCCESSFUL,
    result
  })
}
