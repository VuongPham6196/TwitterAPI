import { ParamSchema } from 'express-validator'
import { isNumber } from 'lodash'

type generalStringSchema = {
  fieldName?: string
  required?: boolean
  minLength?: number
  maxLength?: number
  additionalSchema?: ParamSchema
}

export const generalStringSchema = ({
  fieldName = 'Field',
  required = false,
  minLength = 0,
  maxLength = 100,
  additionalSchema
}: generalStringSchema): ParamSchema => {
  const schema: ParamSchema = {
    optional: !required,
    isString: {
      errorMessage: `${fieldName} must be string!`
    },
    notEmpty: required
      ? {
          errorMessage: `${fieldName} is required!`
        }
      : undefined,
    isLength: {
      options: {
        min: minLength,
        max: maxLength
      },
      errorMessage: `${fieldName} must be from ${minLength} to ${maxLength} characters!`
    },
    trim: true
  }

  return { ...schema, ...additionalSchema }
}

export const enumToNumberArray = (input: { [key: string]: string | number }) => {
  return Object.values(input).filter(isNumber)
}
