import { JwtPayload } from 'jsonwebtoken'
import { TokenType } from '~/constants/enums'
import User from '../schemas/User.schema'

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
export interface verifyForgotPassowrdReqBody {
  forgot_password_token: string
}
export interface resetPasswordReqBody {
  forgot_password_token: string
  password: string
  confirm_password: string
}

export interface TokenPayload extends JwtPayload {
  user_id: string
  token_type: TokenType
}
