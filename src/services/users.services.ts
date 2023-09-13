import User from '~/models/schemas/User.schema'
import databaseServices from './database.services'
import { RegisterReqBody } from '~/models/requests/User.requests'
import { hashPassword } from '~/utils/crypto'
import { signToken } from '~/utils/jwt'
import { TokenType } from '~/constants/enums'
import { ObjectId } from 'mongodb'
import RefreshToken from '~/models/schemas/RefreshToken.schema'

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

  private signAccessAndRefreshToken(user_id: string) {
    return Promise.all([this.signAccessToken(user_id), this.signRefreshToken(user_id)])
  }

  private insertRefeshTokenToDataBase({ user_id, refresh_token }: { user_id: ObjectId; refresh_token: string }) {
    const refreshToken = new RefreshToken({ user_id, refresh_token })
    return databaseServices.refreshTokens.insertOne(refreshToken)
  }

  async registerUser(payload: RegisterReqBody) {
    const result = await databaseServices.users.insertOne(
      new User({ ...payload, date_of_birth: new Date(payload.date_of_birth), password: hashPassword(payload.password) })
    )
    const user_id = result.insertedId.toString()
    const [access_token, refresh_token] = await this.signAccessAndRefreshToken(user_id)
    await this.insertRefeshTokenToDataBase({ user_id: result.insertedId, refresh_token })
    return { access_token, refresh_token }
  }

  async login(user_id: ObjectId) {
    const [access_token, refresh_token] = await this.signAccessAndRefreshToken(user_id.toString())
    await this.insertRefeshTokenToDataBase({ user_id, refresh_token })
    return { access_token, refresh_token }
  }

  async checkEmailExist(email: string) {
    const result = await databaseServices.users.findOne({ email: email })
    return Boolean(result)
  }
}
const usersServices = new UsersServices()

export default usersServices
