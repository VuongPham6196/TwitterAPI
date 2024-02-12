import { Request } from 'express'
import formidable, { File } from 'formidable'
import fs from 'fs'
import { isEmpty } from 'lodash'
import { UPLOAD_IMAGE_TEMP_DIR, UPLOAD_VIDEO_DIR } from '~/constants/dir'
import HTTP_STATUS from '~/constants/httpStatus'
import { UPLOAD_MESSAGE } from '~/constants/messages'
import { ErrorWithStatus } from '~/models/Errors'
import { v4 as uuidv4 } from 'uuid'
import path from 'path'
import { encodeHLSWithMultipleVideoStreams } from './video'

export const initFolder = () => {
  ;[UPLOAD_IMAGE_TEMP_DIR, UPLOAD_VIDEO_DIR].forEach((dir) => {
    const isExistFolder = fs.existsSync(dir)
    if (!isExistFolder) {
      fs.mkdirSync(dir, { recursive: true })
    }
  })
}

class Queue {
  items: string[] = []
  isProcessing: boolean = false

  add(item: string) {
    this.items.push(item)
    this.process()
  }

  async process() {
    if (this.isProcessing || this.items.length === 0) return
    try {
      this.isProcessing = true
      const processingItem = this.items.shift() as string
      console.log('start generate video ', processingItem)
      await encodeHLSWithMultipleVideoStreams(processingItem)
      console.log('generate video success', processingItem)
      this.isProcessing = false
      await this.process()
    } catch (error) {
      console.log('error: ', error)
    }
  }
}

const ItemQueue = new Queue()

export const uploadImageHandler = async (req: Request) => {
  let cancelUploads = false
  const form = formidable({
    maxFiles: 4,
    maxFileSize: 10 * 1024 * 1024, //10MB
    uploadDir: UPLOAD_IMAGE_TEMP_DIR,
    keepExtensions: true,
    filter: function ({ name, mimetype }) {
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
    const [_, files] = await form.parse(req)
    if (isEmpty(files)) {
      throw new ErrorWithStatus({ message: UPLOAD_MESSAGE.FILE_IS_EMPTY, status: HTTP_STATUS.BAD_REQUEST })
    }
    return files.image as File[]
  } catch (err: any) {
    throw new ErrorWithStatus({
      message: `${UPLOAD_MESSAGE.UPLOAD_FAILED}: ${err.message}`,
      status: HTTP_STATUS.BAD_REQUEST
    })
  }
}

export const uploadVideoHandler = async (req: Request) => {
  let cancelUploads = false
  const form = formidable({
    maxFiles: 4,
    maxFileSize: 50 * 1024 * 1024, //50MB
    uploadDir: UPLOAD_VIDEO_DIR,
    filter: function ({ name, mimetype }) {
      const valid = name == 'video' && mimetype && (mimetype.includes('mp4') || mimetype.includes('quicktime'))
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
    const [_, files] = await form.parse(req)
    if (isEmpty(files)) {
      throw new ErrorWithStatus({ message: UPLOAD_MESSAGE.FILE_IS_EMPTY, status: HTTP_STATUS.BAD_REQUEST })
    }
    const videos = files.video as File[]

    videos.forEach((video) => {
      const extension = getExtensionFromFullName(video.originalFilename as string)
      fs.renameSync(video.filepath, video.filepath + '.' + extension)
      video.newFilename = video.newFilename + '.' + extension
    })

    return videos
  } catch (err: any) {
    throw new ErrorWithStatus({
      message: `${UPLOAD_MESSAGE.UPLOAD_FAILED}: ${err.message}`,
      status: HTTP_STATUS.BAD_REQUEST
    })
  }
}

export const uploadHLSVideoHandler = async (req: Request) => {
  const newFileName = uuidv4()
  fs.mkdirSync(path.resolve(UPLOAD_VIDEO_DIR, newFileName))
  let cancelUploads = false
  const form = formidable({
    maxFiles: 1,
    maxFileSize: 25 * 1024 * 1024, //50MB
    filename: () => newFileName,
    uploadDir: path.resolve(UPLOAD_VIDEO_DIR, newFileName),
    filter: function ({ name, mimetype }) {
      const valid = name == 'video' && mimetype && (mimetype.includes('mp4') || mimetype.includes('quicktime'))
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
    const [_, files] = await form.parse(req)
    if (isEmpty(files)) {
      throw new ErrorWithStatus({ message: UPLOAD_MESSAGE.FILE_IS_EMPTY, status: HTTP_STATUS.BAD_REQUEST })
    }
    const videos = files.video as File[]

    videos.forEach((video) => {
      const extension = getExtensionFromFullName(video.originalFilename as string)
      fs.renameSync(video.filepath, video.filepath + '.' + extension)
      video.newFilename = video.newFilename + '.' + extension
      ItemQueue.add(video.filepath + '.' + extension)
    })

    return videos
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

export const getExtensionFromFullName = (fullName: string) => {
  const name = fullName.split('.')
  return name.at(-1)
}
