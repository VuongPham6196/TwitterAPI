import { Request } from 'express'
import formidable, { File } from 'formidable'
import fs from 'fs'
import { isEmpty } from 'lodash'
import { UPLOAD_IMAGE_TEMP_DIR } from '~/constants/dir'
import HTTP_STATUS from '~/constants/httpStatus'
import { UPLOAD_MESSAGE } from '~/constants/messages'
import { ErrorWithStatus } from '~/models/schemas/Errors'

export const initFolder = () => {
  const isExistFolder = fs.existsSync(UPLOAD_IMAGE_TEMP_DIR)
  if (!isExistFolder) {
    fs.mkdirSync(UPLOAD_IMAGE_TEMP_DIR, { recursive: true })
  }
}

export const uploadSingleImageHandler = async (req: Request) => {
  let cancelUploads = false
  const form = formidable({
    maxFiles: 1,
    maxFileSize: 300 * 1024,
    uploadDir: UPLOAD_IMAGE_TEMP_DIR,
    keepExtensions: true,
    filter: function ({ name, originalFilename, mimetype }) {
      const valid = name == 'image' && mimetype && mimetype.includes('image')
      if (!valid) {
        form.emit(
          'error' as any,
          new ErrorWithStatus({ message: UPLOAD_MESSAGE.INVALID_FILE_TYPE, status: HTTP_STATUS.BAD_REQUEST }) as any
        )
        cancelUploads = true
      }
      return Boolean(valid && !cancelUploads)
    }
  })
  try {
    const [fields, files] = await form.parse(req)
    if (isEmpty(files)) {
      throw new ErrorWithStatus({ message: UPLOAD_MESSAGE.FILE_IS_EMPTY, status: HTTP_STATUS.BAD_REQUEST })
    }
    return files.image?.at(0) as File
  } catch (err: any) {
    throw new ErrorWithStatus({
      message: `${UPLOAD_MESSAGE.UPLOAD_FAILED}: ${err.message}`,
      status: HTTP_STATUS.BAD_REQUEST
    })
  }
}

export const getNameFromFullName = (fullName: string) => {
  const name = fullName.split('.')
  name.pop()
  return name.join('')
}
