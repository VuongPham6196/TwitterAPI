import { Router } from 'express'
import { serveImageController, serveVideoController } from '~/controllers/static.controller'

const staticRoute = Router()

staticRoute.get('/images/:name', serveImageController)
staticRoute.get('/videos/:name', serveVideoController)
staticRoute.get('/hls-videos/:name', serveVideoController)

export default staticRoute
