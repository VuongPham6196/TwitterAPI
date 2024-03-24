import { S3 } from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'
import { config } from 'dotenv'
import fs from 'fs'

config()

const s3 = new S3({
  region: process.env.AWS_REGION as string,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY as string,
    secretAccessKey: process.env.AWS_SECRET_KEY as string
  }
})

class S3Service {
  async getListBucket() {
    const data = await s3.listBuckets()
    return data
  }

  async uploadFile(filePath: string, fileName: string, ContentType: string) {
    const parallelUploads3 = new Upload({
      client: s3,
      params: {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: fileName,
        Body: fs.readFileSync(filePath),
        ContentType: ContentType
      },
      tags: [{ Key: ContentType, Value: ContentType }] // optional tags
    })

    parallelUploads3.on('httpUploadProgress', (progress) => {
      console.log(progress)
    })

    const result = await parallelUploads3.done()
    return result
  }
}

const s3Service = new S3Service()

export default s3Service
