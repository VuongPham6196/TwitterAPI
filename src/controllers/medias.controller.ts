import { NextFunction, Request, Response } from 'express'
import formidable, { errors as formidableErrors } from 'formidable'
import { isEmpty } from 'lodash'
import path from 'path'
import { UPLOAD_IMAGE_TEMP_DIR } from '~/constants/dir'
import HTTP_STATUS from '~/constants/httpStatus'
import { UPLOAD_MESSAGE } from '~/constants/messages'
import { ErrorWithStatus } from '~/models/schemas/Errors'
import mediasServices from '~/services/medias.services'

export const uploadSingleImageController = async (req: Request, res: Response, next: NextFunction) => {
  const result = await mediasServices.unloadImageHandler(req)
  res.json({
    message: UPLOAD_MESSAGE.UPLOAD_SUCCESSFUL,
    result
  })
}
