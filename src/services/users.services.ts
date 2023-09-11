import User from '~/models/schemas/User.schema'
import databaseServices from './database.services'
import { RegisterReqBody } from '~/models/requests/User.requests'
import { hashPassword } from '~/utils/crypto'
import { signToken } from '~/utils/jwt'
import { TokenType } from '~/constants/enums'

class UsersServices {
  private signAccessToken(user_id: string) {
    return signToken({
      payload: { user_id, token_type: TokenType.AccessToken },
      options: { expiresIn: process.env.ACCESS_TOKEN_LIFE }
    })
  }
  private signRefreshToken(user_id: string) {
    return signToken({
      payload: { user_id, token_type: TokenType.RefreshToken },
      options: { expiresIn: process.env.REFRESH_TOKEN_LIFE }
    })
  }

  async registerUser(payload: RegisterReqBody) {
    const result = await databaseServices.users.insertOne(
      new User({ ...payload, date_of_birth: new Date(payload.date_of_birth), password: hashPassword(payload.password) })
    )
    const user_id = result.insertedId.toString()
    const [access_token, refesh_token] = await Promise.all([
      this.signAccessToken(user_id),
      this.signRefreshToken(user_id)
    ])
    return { access_token, refesh_token }
  }

  async login(payload: { username: string; password: string }) {
    const { username, password } = payload
    const result = await databaseServices.users.findOne({ username, password })
    console.log('result: ', result)

    if (!result) return null
    const user_id = result._id.toString()
    const [access_token, refesh_token] = await Promise.all([
      this.signAccessToken(user_id),
      this.signRefreshToken(user_id)
    ])

    return { result, access_token, refesh_token }
  }

  async checkEmailExist(email: string) {
    const result = await databaseServices.users.findOne({ email: email })
    return Boolean(result)
  }
}
const usersServices = new UsersServices()

export default usersServices
