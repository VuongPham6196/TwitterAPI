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

    const result: Media[] = await Promise.all(
      files.map(async ({ filepath, newFilename, mimetype }) => {
        const newName = getNameFromFullName(newFilename) + '.jpg'
        const newPath = path.resolve(UPLOAD_IMAGE_DIR, newName)
        await sharp(filepath).jpeg().toFile(path.resolve(newPath))
        const s3Result = await s3Service.uploadFile(newPath, 'images/' + newName, mimetype as string)

        await fs.promises.unlink(filepath)
        await fs.promises.unlink(newPath)

        return {
          url: s3Result.Location as string,
          type: MediaType.Image
        }
      })
    )

    return result
  }

  async uploadVideoHandler(req: Request) {
    const files = await uploadVideoHandler(req)

    const uploadToS3Result: Media[] = await Promise.all(
      files.map(async ({ filepath, newFilename, mimetype }) => {
        const s3Result = await s3Service.uploadFile(filepath, 'videos/' + newFilename, mimetype as string)
        await fs.promises.unlink(filepath)
        return {
          url: s3Result.Location as string,
          type: MediaType.Video
        }
      })
    )

    return uploadToS3Result
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
