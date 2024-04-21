import { createHash } from 'crypto'
import { envConfig } from './config'

export function sha256(content: string) {
  return createHash('sha256').update(content).digest('hex')
}

export function hashPassword(password: string) {
  return sha256(`${envConfig.PASSWORD_SECRET}${password}`)
}
