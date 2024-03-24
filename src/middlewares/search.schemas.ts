import { ParamSchema } from 'express-validator'
import { MediaType } from '~/constants/enums'
import { SEARCH_MESSAGE } from '~/constants/messages'
import { enumToStringArray } from '~/utils/general'

export const MediaTypeSchema: ParamSchema = {
  optional: true,
  isIn: {
    options: [enumToStringArray(MediaType).map((item) => item.toLowerCase())],
    errorMessage: SEARCH_MESSAGE.INVALID_MEDIA_TYPE
  }
}

export const PeopleFollowSchema: ParamSchema = {
  optional: true,
  isIn: {
    options: [['false', 'true']],
    errorMessage: SEARCH_MESSAGE.INVALID_PEOPLE_FOLOLW
  }
}
