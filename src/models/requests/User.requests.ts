import { ParamsDictionary } from 'express-serve-static-core'
import { JwtPayload } from 'jsonwebtoken'
import { TokenType, UserVerifyStatus } from '~/constants/enums'
import User from '../schemas/User.schema'

export interface RegisterReqBody {
  username: string
  password: string
  email: string
  confirm_password: string
  date_of_birth: string
  name: string
  avatar?: string
}
export interface RefreshTokenReqBody {
  refresh_token: string
}

export interface LogoutReqBody {
  refresh_token: string
}
export interface VerifyEmailReqBody {
  decoded_verify_email_token: TokenPayload
}
export interface ForgotPassowrdReqBody {
  email: string
}
export interface VerifyForgotPassowrdReqBody {
  email: string
}
export interface VerifyForgotPassowrdReqBody {
  forgot_password_token: string
}
export interface ResetPasswordReqBody {
  forgot_password_token: string
  password: string
  confirm_password: string
}

export type UpdateMeReqBody = Partial<
  Pick<User, 'name' | 'bio' | 'username' | 'website' | 'avatar' | 'cover_photo' | 'date_of_birth' | 'location'>
>
export interface FollowReqBody {
  followed_user_id: string
}

export interface TokenPayload extends JwtPayload {
  user_id: string
  token_type: TokenType
  verify: UserVerifyStatus
  exp?: number
}

export interface GetUserProfileParams extends ParamsDictionary {
  user_id: string
}
export interface UnfollowParams extends ParamsDictionary {
  followed_user_id: string
}

export interface ChangePasswordReqBody {
  oldPassword: string
  newPassword: string
  confirmNewPassword: string
}
