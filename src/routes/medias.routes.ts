import { Router } from 'express'
import { uploadHLSVideoController, uploadImageController, uploadVideoController } from '~/controllers/medias.controller'
import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { WrapAsync } from '~/utils/handlers'

const mediasRoute = Router()

mediasRoute.post('/upload-image', accessTokenValidator, verifiedUserValidator, WrapAsync(uploadImageController))
mediasRoute.post('/upload-video', accessTokenValidator, verifiedUserValidator, WrapAsync(uploadVideoController))
mediasRoute.post('/upload-hls-video', accessTokenValidator, verifiedUserValidator, WrapAsync(uploadHLSVideoController))

export default mediasRoute
