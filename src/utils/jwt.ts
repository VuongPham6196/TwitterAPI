import { config } from 'dotenv'
import jwt from 'jsonwebtoken'
import { TokenPayload } from '~/models/requests/User.requests'
config()

export const signToken = ({
  payload,
  privateKey,
  options = { algorithm: 'HS256' }
}: {
  payload: string | object | Buffer
  privateKey: string
  options?: jwt.SignOptions
}) => {
  return new Promise<string>((res, rej) =>
    jwt.sign(payload, privateKey, options, (err, token) => {
      if (err) throw rej(err)
      res(token as string)
    })
  )
}

export const verifyToken = ({
  token,
  secretKey,
  options = { algorithms: ['HS256'] }
}: {
  token: string
  secretKey: string
  options?: jwt.VerifyOptions
}) => {
  return new Promise<TokenPayload>((res, rej) =>
    jwt.verify(token, secretKey, options, (err, decoded) => {
      if (err) throw rej(err)
      res(decoded as TokenPayload)
    })
  )
}
