import User from '~/models/schemas/User.schema'
import databaseServices from './database.services'
import { RegisterReqBody, TokenPayload, UpdateMeReqBody } from '~/models/requests/User.requests'
import { hashPassword } from '~/utils/crypto'
import { signToken } from '~/utils/jwt'
import { TokenType, UserVerifyStatus } from '~/constants/enums'
import { ObjectId } from 'mongodb'
import RefreshToken from '~/models/schemas/RefreshToken.schema'
import { config } from 'dotenv'
import { USER_MESSAGES } from '~/constants/messages'
config()

interface signTokenProps {
  user_id: string
  verify: UserVerifyStatus
}

interface InsertRefeshTokenToDataBaseProps {
  user_id: string
  refresh_token: string
}

class UsersServices {
  private signAccessToken({ user_id, verify }: signTokenProps) {
    return signToken({
      payload: { user_id, token_type: TokenType.AccessToken, verify },
      privateKey: process.env.JWT_ACCESS_TOKEN_SECRET as string,
      options: { expiresIn: process.env.ACCESS_TOKEN_LIFE }
    })
  }
  private signRefreshToken({ user_id, verify }: signTokenProps) {
    return signToken({
      payload: { user_id, token_type: TokenType.RefreshToken, verify },
      privateKey: process.env.JWT_REFRESH_TOKEN_SECRET as string,
      options: { expiresIn: process.env.REFRESH_TOKEN_LIFE }
    })
  }
  private signVerifyEmailToken({ user_id, verify }: signTokenProps) {
    return signToken({
      payload: { user_id, token_type: TokenType.EmailVerifyToken, verify },
      privateKey: process.env.JWT_VERIFY_EMAIL_TOKEN_SECRET as string,
      options: { expiresIn: process.env.VERIFY_EMAIL_TOKEN_LIFE }
    })
  }

  private signForgotPasswordToken({ user_id, verify }: signTokenProps) {
    return signToken({
      payload: { user_id, token_type: TokenType.ForgotPasswordToken, verify },
      privateKey: process.env.JWT_FORGOT_PASSWORD_TOKEN_SECRET as string,
      options: { expiresIn: process.env.FORGOT_PASSWORD_TOKEN_LIFE }
    })
  }

  private signAccessAndRefreshToken({ user_id, verify }: signTokenProps) {
    return Promise.all([this.signAccessToken({ user_id, verify }), this.signRefreshToken({ user_id, verify })])
  }

  private insertRefeshTokenToDataBase({ user_id, refresh_token }: InsertRefeshTokenToDataBaseProps) {
    const refreshToken = new RefreshToken({ user_id: new ObjectId(user_id), refresh_token })
    return databaseServices.refreshTokens.insertOne(refreshToken)
  }

  async registerUser(payload: RegisterReqBody) {
    const result = await databaseServices.users.insertOne(
      new User({ ...payload, date_of_birth: new Date(payload.date_of_birth), password: hashPassword(payload.password) })
    )
    const user_id = result.insertedId.toString()
    const verify_email_token = await this.signVerifyEmailToken({ user_id, verify: UserVerifyStatus.Unverified })
    await databaseServices.users.updateOne(
      { _id: result.insertedId },
      { $set: { email_verify_token: verify_email_token } }
    )
    return { verify_email_token }
  }

  async login({ user_id, verify }: signTokenProps) {
    const [access_token, refresh_token] = await this.signAccessAndRefreshToken({
      user_id: user_id.toString(),
      verify
    })
    await this.insertRefeshTokenToDataBase({ user_id: user_id.toString(), refresh_token })
    return { access_token, refresh_token }
  }

  async logout(refresh_token: string) {
    await databaseServices.refreshTokens.deleteOne({ refresh_token: refresh_token })
    return { message: USER_MESSAGES.LOGOUT_SUCCESSFUL }
  }

  async checkEmailExist(email: string) {
    const result = await databaseServices.users.findOne({ email: email })
    return Boolean(result)
  }

  async verifyEmail({ user_id, verify }: signTokenProps) {
    await databaseServices.users.updateOne({ _id: new ObjectId(user_id) }, [
      { $set: { verify: UserVerifyStatus.Verified, email_verify_token: '', updated_at: '$$NOW' } }
    ])
    return this.login({ user_id, verify })
  }

  async resendVerifyEmail({ user_id, verify }: signTokenProps) {
    const verify_email_token = await this.signVerifyEmailToken({ user_id, verify })
    await databaseServices.users.updateOne(
      { _id: new ObjectId(user_id) },
      {
        $set: { email_verify_token: verify_email_token },
        $currentDate: {
          updated_at: true
        }
      }
    )
    return { verify_email_token }
  }

  async forgotPassword({ user_id, verify }: signTokenProps) {
    const forgot_password_token = await this.signForgotPasswordToken({ user_id, verify })
    await databaseServices.users.updateOne(
      { _id: new ObjectId(user_id) },
      {
        $set: { forgot_password_token: forgot_password_token },
        $currentDate: {
          updated_at: true
        }
      }
    )
    console.log(
      "Send email to user's email + forgot_password_token:",
      `https://twitter.com/verify-forgot-passowrd?forgot-passowrd-token=${forgot_password_token}`
    )
    return { forgot_password_token }
  }

  async resetPassword(user_id: string, password: string) {
    await databaseServices.users.updateOne(
      { _id: new ObjectId(user_id) },
      {
        $set: { password: hashPassword(password), forgot_password_token: '' },
        $currentDate: {
          updated_at: true
        }
      }
    )
    return { message: USER_MESSAGES.RESET_PASSWORD_SUCCESSFUL }
  }

  async getMe(user_id: string) {
    const user = await databaseServices.users.findOne(
      { _id: new ObjectId(user_id) },
      { projection: { password: 0, email_verify_token: 0, forgot_password_token: 0 } }
    )
    return user
  }

  async updateMe(user_id: string, payload: UpdateMeReqBody) {
    const updateData = { ...payload } as Omit<UpdateMeReqBody, 'date_of_birth'> & {
      date_of_birth?: Date
    }

    if (payload.date_of_birth) {
      updateData.date_of_birth = new Date(payload.date_of_birth)
    }

    const user = await databaseServices.users.findOneAndUpdate(
      {
        _id: new ObjectId(user_id)
      },
      {
        $set: {
          ...updateData
        },
        $currentDate: {
          updated_at: true
        }
      },
      {
        returnDocument: 'after',
        projection: { password: 0, email_verify_token: 0, forgot_password_token: 0 }
      }
    )
    return user.value
  }
}

const usersServices = new UsersServices()

export default usersServices
