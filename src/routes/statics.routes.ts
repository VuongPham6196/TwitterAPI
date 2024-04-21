import { Router } from 'express'
import { serveImageController, serveVideoController } from '~/controllers/static.controller'

const staticRoute = Router()

/**
 * Description: view static image
 * Path: /images/:name
 * Method: GET
 * Params:{name:string}
 */
staticRoute.get('/images/:name', serveImageController)

/**
 * Description: view static video
 * Path: /videos/:name
 * Method: GET
 * Params:{name:string}
 */
staticRoute.get('/videos/:name', serveVideoController)

/**
 * Description: view hls video
 * Path: /hls-videos/:name
 * Method: GET
 * Params:{name:string}
 */
staticRoute.get('/hls-videos/:name', serveVideoController)

export default staticRoute
