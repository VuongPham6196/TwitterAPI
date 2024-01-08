import { Router } from 'express'
import { uploadSingleImageController } from '~/controllers/medias.controller'
import { WrapAsync } from '~/utils/handlers'

const mediasRoute = Router()

mediasRoute.post('/upload-image', WrapAsync(uploadSingleImageController))

export default mediasRoute
