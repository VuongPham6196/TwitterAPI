import User, { UserType } from '~/models/schemas/User.schema'
import databaseServices from './database.services'
import { RegisterReqBody, UpdateMeReqBody } from '~/models/requests/User.requests'
import { hashPassword } from '~/utils/crypto'
import { signToken } from '~/utils/jwt'
import { TokenType, UserVerifyStatus } from '~/constants/enums'
import { ObjectId } from 'mongodb'
import RefreshToken from '~/models/schemas/RefreshToken.schema'
import { config } from 'dotenv'
import { USER_MESSAGES } from '~/constants/messages'
import Follow from '~/models/schemas/Follow.schema'
import axios from 'axios'
import { ErrorWithStatus } from '~/models/Errors'
import HTTP_STATUS from '~/constants/httpStatus'
import _ from 'lodash'

config()

interface signTokenProps {
  user_id: string
  verify: UserVerifyStatus
}

interface InsertRefeshTokenToDataBaseProps {
  user_id: string
  refresh_token: string
}

type OAuthRespone = {
  access_token: string
  refresh_token: string
  newUser: boolean
  verify: UserVerifyStatus
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

  private async getOauthGoogleToken(code: string) {
    const body = {
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI,
      grant_type: 'authorization_code'
    }
    const { data } = await axios.post('https:/oauth2.googleapis.com/token', body, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })

    return data as { id_token: string; access_token: string }
  }

  private async getGoogleUserInfo(access_token: string, id_token: string) {
    const { data } = await axios.get('https:/www.googleapis.com/oauth2/v1/userinfo', {
      params: {
        access_token,
        alt: 'json'
      },
      headers: {
        Authorization: `Bearer ${id_token}`
      }
    })

    return data as {
      email: string
      verified_email: boolean
      name: string
      picture: string
    }
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
    console.log('send token to email: ', verify_email_token)
    const data = await this.login({ user_id, verify: UserVerifyStatus.Unverified })
    return data
  }

  async login({ user_id, verify }: signTokenProps) {
    const [access_token, refresh_token] = await this.signAccessAndRefreshToken({
      user_id: user_id.toString(),
      verify
    })
    await this.insertRefeshTokenToDataBase({ user_id: user_id.toString(), refresh_token })
    return { access_token, refresh_token }
  }

  async oauth(code: string): Promise<OAuthRespone> {
    const { id_token, access_token } = await this.getOauthGoogleToken(code)
    const userInfo = await this.getGoogleUserInfo(access_token, id_token)
    if (!userInfo.verified_email) {
      throw new ErrorWithStatus({ status: HTTP_STATUS.BAD_REQUEST, message: USER_MESSAGES.GMAIL_NOT_VERIFIED })
    }

    const user = await databaseServices.users.findOne({ email: userInfo.email })

    if (user) {
      const data = await this.login({ user_id: user._id.toString(), verify: UserVerifyStatus.Verified })
      return {
        ...data,
        newUser: false,
        verify: user.verify
      }
    } else {
      const passowrd = _.capitalize(Math.random().toString(36).slice(2) + '@')
      const data = await this.registerUser({
        email: userInfo.email,
        name: userInfo.name,
        username: userInfo.email,
        password: passowrd,
        confirm_password: passowrd,
        date_of_birth: new Date().toISOString(),
        avatar: userInfo.picture
      })

      return { ...data, newUser: true, verify: UserVerifyStatus.Unverified }
    }
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
      `http://localhost:3000/user/verify-forgot-passowrd?forgot-passowrd-token=${forgot_password_token}`
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
      {
        projection: { password: 0, email_verify_token: 0, forgot_password_token: 0 } as Partial<
          Record<keyof UserType, number>
        >
      }
    )
    return user
  }

  async getProfile(user_id: string) {
    const user = await databaseServices.users.findOne(
      { _id: new ObjectId(user_id) },
      {
        projection: { password: 0, email_verify_token: 0, forgot_password_token: 0 } as Partial<
          Record<keyof UserType, number>
        >
      }
    )
    return user
  }

  async updateMe(user_id: string, payload: UpdateMeReqBody) {
    //must filter body field for risks such as token
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

  async follow(user_id: string, followed_user_id: string) {
    const follow = new Follow({
      user_id: new ObjectId(user_id),
      followed_user_id: new ObjectId(followed_user_id)
    })

    await databaseServices.follows.insertOne(follow)
    return { message: USER_MESSAGES.FOLLOW_SUCCESS }
  }

  async unfollow(user_id: string, followed_user_id: string) {
    await databaseServices.follows.deleteMany({
      user_id: new ObjectId(user_id),
      followed_user_id: new ObjectId(followed_user_id)
    })

    return { message: USER_MESSAGES.UNFOLLOW_SUCCESS }
  }

  async changePassword(user_id: string, newPassword: string) {
    await databaseServices.users.updateOne(
      { _id: new ObjectId(user_id) },
      {
        $set: { password: hashPassword(newPassword) },
        $currentDate: {
          updated_at: true
        }
      }
    )

    return { message: USER_MESSAGES.CHANGE_PASSWORD_SUCCESSFUL }
  }
}

const usersServices = new UsersServices()

export default usersServices
