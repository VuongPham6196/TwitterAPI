import { Router } from 'express'
import { searchController } from '~/controllers/searchController'
import { searchValidator } from '~/middlewares/search.middlewares'
import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { WrapAsync } from '~/utils/handlers'

const searchRouter = Router()

/**
 * Description: Search
 * Path: /
 * Method: GET
 * Header: {Authorization: Bearer <access_token>}
 * Query:{content:string, page_number: number, page_size: number}
 */
searchRouter.get('/', accessTokenValidator, verifiedUserValidator, searchValidator, WrapAsync(searchController))

export default searchRouter
