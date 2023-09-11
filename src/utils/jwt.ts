import jwt from 'jsonwebtoken'

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
