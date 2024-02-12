import { config } from 'dotenv'
import { Request } from 'express'
import path from 'path'
import sharp from 'sharp'
import { UPLOAD_IMAGE_DIR } from '~/constants/dir'
import { MediaType } from '~/constants/enums'
import { Media } from '~/models/Others'
import { isProduction } from '~/utils/config'
import { getNameFromFullName, uploadHLSVideoHandler, uploadImageHandler, uploadVideoHandler } from '~/utils/file'

config()

class MediasServices {
  async uploadImageHandler(req: Request) {
    const files = await uploadImageHandler(req)
    const result: Media[] = await Promise.all(
      files.map(async (file) => {
        const newName = getNameFromFullName(file.newFilename) + '.jpg'
        const newPath = path.resolve(UPLOAD_IMAGE_DIR, newName)
        await sharp(file.filepath).jpeg().toFile(path.resolve(newPath))
        return {
          url: isProduction
            ? `https://tw-v1/static/images/${newName}`
            : `http://localhost:${process.env.PORT}/static/images/${newName}`,
          type: MediaType.Image
        }
      })
    )

    return result
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

const mediasServices = new MediasServices()

export default mediasServices
