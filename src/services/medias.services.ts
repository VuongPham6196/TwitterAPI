import { Request } from 'express'
import path from 'path'
import sharp from 'sharp'
import { UPLOAD_IMAGE_DIR } from '~/constants/dir'
import { getNameFromFullName, uploadSingleImageHandler } from '~/utils/file'

class MediasServices {
  async unloadImageHandler(req: Request) {
    const file = await uploadSingleImageHandler(req)
    const newName = getNameFromFullName(file.newFilename)
    const newPath = path.resolve(UPLOAD_IMAGE_DIR, `${newName}.jpg`)
    await sharp(file.filepath).jpeg().toFile(path.resolve(newPath))
    return `http://localhost:3000/photo/${newName}`
  }
}

const mediasServices = new MediasServices()

export default mediasServices
