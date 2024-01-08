import { NextFunction, Request, Response } from 'express'
import { UPLOAD_MESSAGE } from '~/constants/messages'
import mediasServices from '~/services/medias.services'

export const uploadSingleImageController = async (req: Request, res: Response, next: NextFunction) => {
  const result = await mediasServices.unloadImageHandler(req)
  res.json({
    message: UPLOAD_MESSAGE.UPLOAD_SUCCESSFUL,
    result
  })
}
