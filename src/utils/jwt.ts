import { config } from 'dotenv'
import jwt from 'jsonwebtoken'
import { TokenPayload } from '~/models/requests/User.requests'
config()

export const signToken = ({
  payload,
  privateKey = process.env.JWT_SECRET as string,
  options = { algorithm: 'HS256' }
}: {
  payload: string | object | Buffer
  privateKey?: string
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
  publicKey = process.env.JWT_SECRET as string,
  options = { algorithms: ['HS256'] }
}: {
  token: string
  publicKey?: string
  options?: jwt.VerifyOptions
}) => {
  return new Promise<TokenPayload>((res, rej) =>
    jwt.verify(token, publicKey, options, (err, decoded) => {
      if (err) throw rej(err)
      res(decoded as TokenPayload)
    })
  )
}
