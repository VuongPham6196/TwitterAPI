import { checkSchema } from 'express-validator'
import { generalStringSchema } from '~/utils/general'
import { validate } from '~/utils/validation'
import { PeopleFollowSchema, MediaTypeSchema } from './search.schemas'

export const searchValidator = validate(
  checkSchema(
    {
      content: generalStringSchema({ fieldName: 'content', required: true }),
      media_type: MediaTypeSchema,
      people_follow: PeopleFollowSchema
    },
    ['query']
  )
)
