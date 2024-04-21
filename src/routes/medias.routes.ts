import { Router } from 'express'
import { uploadHLSVideoController, uploadImageController, uploadVideoController } from '~/controllers/medias.controller'
import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { WrapAsync } from '~/utils/handlers'

const mediasRoute = Router()

/**
 * Description: Upload images
 * Path: /upload-image
 * Method: POST
 * Header: {Authorization: Bearer <access_token>}
 * Body: {image: File:{maxFiles: 4, maxFileSize: 25MB}}
 */
mediasRoute.post('/upload-image', accessTokenValidator, verifiedUserValidator, WrapAsync(uploadImageController))

/**
 * Description: Upload videos
 * Path: /upload-image
 * Method: POST
 * Header: {Authorization: Bearer <access_token>}
 * Body: {video: File:{maxFiles: 2, maxFileSize: 100MB}}
 */
mediasRoute.post('/upload-video', accessTokenValidator, verifiedUserValidator, WrapAsync(uploadVideoController))

/**
 * Description: Upload HLS videos
 * Path: /upload-hls-video
 * Method: POST
 * Header: {Authorization: Bearer <access_token>}
 * Params: {video: File:{maxFiles: 2, maxFileSize: 100MB}}
 */
mediasRoute.post('/upload-hls-video', accessTokenValidator, verifiedUserValidator, WrapAsync(uploadHLSVideoController))

export default mediasRoute
