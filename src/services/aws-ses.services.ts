import { SendEmailCommand, SESClient } from '@aws-sdk/client-ses'
import { config } from 'dotenv'
import fs from 'fs'
import path from 'path'
import { envConfig } from '~/utils/config'

config()

const sesClient = new SESClient({
  region: envConfig.AWS_REGION,
  credentials: {
    accessKeyId: envConfig.AWS_ACCESS_KEY,
    secretAccessKey: envConfig.AWS_SECRET_KEY
  }
})

interface ISendEmail {
  title: string
  toAddress: string | string[]
  fromAddress: string
  content: string
  ccAddresses?: string[]
  replyToAddresses?: string[]
}

const createSendEmailCommand = ({
  title,
  content,
  fromAddress,
  toAddress,
  ccAddresses,
  replyToAddresses
}: ISendEmail) => {
  return new SendEmailCommand({
    Destination: {
      CcAddresses: ccAddresses,
      ToAddresses: toAddress instanceof Array ? toAddress : [toAddress]
    },
    Message: {
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: content
        }
      },
      Subject: {
        Charset: 'UTF-8',
        Data: title
      }
    },
    Source: fromAddress,
    ReplyToAddresses: replyToAddresses
  })
}

const accountTemplate = fs.readFileSync(path.resolve('src', 'templates', 'emai-account.html'), 'utf-8')

class EmailService {
  sendRegisterVerifyEmail(
    title: string,
    toAddress: string | string[],
    content: string,
    linkTitle: string,
    verifyUrl: string
  ) {
    const sendEmailCommand = createSendEmailCommand({
      toAddress,
      content: accountTemplate
        .replace('{{content}}', content)
        .replace('{{linkTitle}}', linkTitle)
        .replace('{{link}}', verifyUrl),
      title: title,
      fromAddress: envConfig.AWS_REGISTER_EMAIL
    })
    return sesClient.send(sendEmailCommand)
  }
}

const emailService = new EmailService()

export default emailService
