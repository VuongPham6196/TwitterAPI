import { config } from 'dotenv'
import { Request } from 'express'
import path from 'path'
import sharp from 'sharp'
import { UPLOAD_IMAGE_DIR } from '~/constants/dir'
import { MediaType } from '~/constants/enums'
import { Media } from '~/models/Others'
import { isProduction } from '~/utils/config'
import { getNameFromFullName, uploadHLSVideoHandler, uploadImageHandler, uploadVideoHandler } from '~/utils/file'
import s3Service from './aws-s3.services'
import fs from 'fs'

config()

class MediaServices {
  async uploadImageHandler(req: Request) {
    const files = await uploadImageHandler(req)
    const convertedFiles: { name: string; path: string }[] = await Promise.all(
      files.map(async (file) => {
        const newName = getNameFromFullName(file.newFilename) + '.jpg'
        const newPath = path.resolve(UPLOAD_IMAGE_DIR, newName)
        await sharp(file.filepath).jpeg().toFile(path.resolve(newPath))
        return { name: newName, path: newPath }
      })
    )
    const uploadToS3Result: Media[] = await Promise.all(
      convertedFiles.map(async (file) => {
        const s3Result = await s3Service.uploadFile(file.path, file.name, 'image/jpeg')
        return {
          url: s3Result.Location as string,
          type: MediaType.Image
        }
      })
    )
    await Promise.all([
      ...files.map((item) => fs.promises.unlink(item.filepath)),
      ...convertedFiles.map((item) => fs.promises.unlink(item.path))
    ])

    return uploadToS3Result
  }

  async uploadVideoHandler(req: Request) {
    const files = await uploadVideoHandler(req)
    const result: Media[] = files.map((file) => {
      return {
        url: isProduction
          ? `https://tw-v1/static/videos/${file.newFilename}`
          : `http://localhost:${process.env.PORT}/static/videos/${file.newFilename}`,
        type: MediaType.Video
      }
    })

    return result
  }

  async uploadHLSVideoHandler(req: Request) {
    const files = await uploadHLSVideoHandler(req)
    const result: Media[] = files.map((file) => {
      return {
        url: isProduction
          ? `https://tw-v1/static/hls-videos/${file.newFilename}`
          : `http://localhost:${process.env.PORT}/static/hls-videos/${file.newFilename}`,
        type: MediaType.Video
      }
    })

    return result
  }
}

const mediaServices = new MediaServices()

export default mediaServices
