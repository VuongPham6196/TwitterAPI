import { JwtPayload } from 'jsonwebtoken'
import { TokenType, UserVerifyStatus } from '~/constants/enums'

export interface RegisterReqBody {
  username: string
  password: string
  email: string
  confirm_password: string
  date_of_birth: string
  name: string
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

export interface UpdateMeReqBody {
  name?: string
  bio?: string
  location?: string
  website?: string
  avatar?: string
  cover_photo?: string
  date_of_birth?: string
}
export interface FollowReqBody {
  followed_user_id: string
}

export interface TokenPayload extends JwtPayload {
  user_id: string
  token_type: TokenType
  verify: UserVerifyStatus
}

export interface GetUserProfileParams {
  user_id: string
}
