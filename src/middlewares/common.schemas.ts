import { ParamSchema } from 'express-validator'
import { QUERY_PARAMS_MESSAGE } from '~/constants/messages'

export const PageNumberSchema: ParamSchema = {
  isInt: true,
  custom: {
    options: (value) => {
      if (value < 1) {
        throw new Error(QUERY_PARAMS_MESSAGE.INVALID_PAGE_NUMBER)
      }
      return true
    }
  }
}

export const PageSizeSchema: ParamSchema = {
  isInt: true,
  custom: {
    options: (value) => {
      if (value < 1 || value > 100) {
        throw new Error(QUERY_PARAMS_MESSAGE.INVALID_PAGE_NUMBER)
      }
      return true
    }
  }
}
