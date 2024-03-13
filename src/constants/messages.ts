export const USER_MESSAGES = {
  LOGIN_FAILED: 'Login failed',
  LOGIN_SUCCESSFUL: 'Login successful',
  REGISTER_FAILED: 'Register failed',
  REGISTER_SUCCESSFUL: 'Register successful',
  REFRESH_TOKEN_SUCCESS: 'Refresh token successful',
  VALIDATION_ERROR: 'Validation error',
  USERNAME_AND_PASSWORD_ARE_REQUIRED: 'Username and password are required',
  USERNAME_IS_REQUIRED: 'UserName is required',
  USERNAME_MUST_BE_STRING: 'UserName must be a string',
  USERNAME_MUST_BE_FROM_4_TO_15_CHARACTERS: 'UserName must be from 4 to 15 characters',
  USERNAME_ALREADY_EXIST: 'Username already exist',
  USERNAME_INVALID: 'Username must not contains numbers only and special characters',
  EMAIL_IS_REQUIRED: 'Email is required',
  EMAIL_MUST_BE_STRING: 'Email must be a string',
  EMAIL_MUST_BE_VALID: 'Email must be a valid email',
  EMAIL_ALREADY_EXISTS: 'Email already exists',
  PASSWORD_IS_REQUIRED: 'Password is required',
  PASSWORD_MUST_BE_STRING: 'Password must be a string',
  PASSWORD_MUST_BE_FROM_6_TO_50_CHARACTERS: 'Password must be from 6 to 50 characters',
  PASSWORD_MUST_BE_STRONG:
    'Password must be at least 6 characters and contain at least one lowercase letter, one uppercase letter, one number and one symbol',
  PASSWORD_INCORRECT: 'Password is incorrect',
  PASSWORD_SHOULD_DIFFERRENCE:
    'The new password you entered is the same as the old password. Please enter a different password',
  CHANGE_PASSWORD_SUCCESSFUL: 'Change password succesfully',
  CONFIRM_PASSWORD_IS_REQUIRED: 'Confirm password is required',
  CONFIRM_PASSWORD_MUST_BE_STRING: 'Confirm password must be a string',
  CONFIRM_PASSWORD_MUST_BE_FROM_6_TO_50_CHARACTERS: 'Confirm password must be from 6 to 50 characters',
  CONFIRM_PASSWORD_MUST_BE_STRONG:
    'Confirm password must be at least 6 characters and contain at least one lowercase letter, one uppercase letter, one number and one symbol',
  PASSWORDS_DO_NOT_MATCH: 'Passwords do not match',
  EMAIL_OR_PASSWORD_INCORRECT: 'Email or password incorrect',
  USER_ALREADY_EXISTS: 'User already exists',
  USER_CREATED: 'User created',
  DATE_OF_BIRTH_MUST_BE_ISO_8601: 'Date of birth must be in ISO 8601 format',
  ACCESS_TOKEN_IS_INVALID: 'Access token is invalid',
  LOGOUT_SUCCESSFUL: 'Logout successful',
  REFRESH_TOKEN_IS_REQUIRED: 'Refresh token is required',
  REFRESH_TOKEN_IS_INVALID: 'Refresh token is invalid',
  REFRESH_TOKEN_IS_NOT_EXIST: 'Refresh token is not exist',
  LOGOUT_FAILED: 'Logout failed',
  VERIFY_EMAIL_TOKEN_IS_REQUIRED: 'Verify email token is required',
  VERIFY_EMAIL_TOKEN_IS_INVALID: 'Verify email token is invalid',
  VERIFY_EMAIL_SUCCESSFUL: 'Verify email successful',
  USER_NOT_FOUND: 'User not found',
  ALREADY_VERIFIED_EMAIL_BEFORE: 'Already verified email before',
  ACCOUNT_BANNED: 'Account banned',
  NOT_VERIFIED_EMAIL: 'Not verified email',
  RESEND_VERIFY_EMAIL_SUCCESSFUL: 'Resend verify email successful',
  CHECK_EMAIL_TO_RESET_PASSWORD: 'Check email to reset password',
  FORGOT_PASSWORD_TOKEN_IS_REQUIRED: 'Forgot password token is required',
  INVALID_FORGOT_PASSWORD_TOKEN: 'Invalid forgot password token',
  VERIFY_FORGOT_PASSWORD_TOKEN_SUCCESSFUL: 'Verify forgot password token successful',
  RESET_PASSWORD_SUCCESSFUL: 'Reset password successful',
  GET_ME_SUCCESSFUL: 'Get me successful',
  USER_NOT_VERIFIED: 'User not verified',
  UPDATE_ME_SUCCESSFUL: 'Update me successful',
  NAME_IS_REQUIRED: 'Name is required',
  USERID_IS_REQUIRED: 'Userid is required',
  USERID_IS_INVALID: 'Invalid userid',
  GET_PROFILE_SUCCESSFUL: 'Get profile successful',
  FOLLOW_SUCCESS: 'Follow successful',
  UNFOLLOW_SUCCESS: 'Unfollow successful',
  ALREADY_FOLLOWED: 'Already followed',
  ALREADY_UNFOLLOWED: 'Already unfollowed',
  CANNOT_FOLLOW_OR_UNFOLLOW_YOURSELF: 'Can not follow or unfollow yourself',
  GMAIL_NOT_VERIFIED: 'Gmail not verified',
  TWEET_CIRCLE_INVALID: 'Tweet circle invalid'
} as const

export const UPLOAD_MESSAGE = {
  UPLOAD_SUCCESSFUL: 'Upload successfull',
  UPLOAD_FAILED: 'Upload failed',
  FILE_IS_EMPTY: 'File is empty',
  INVALID_FILE_TYPE: 'Invalid file type',
  NOT_FOUND: 'File not found!'
} as const

export const MEDIA_MESSAGE = {
  RANGE_IS_REQUIRED: 'Range is required'
} as const

export const TWEET_MESSAGE = {
  INVALID_TWEET_TYPE: 'Invalid tweet type',
  INVALID_AUDIENCE: 'Invalid audience',
  HASHTAGS_MUST_BE_ARRAY_OF_STRING: 'Hashtags must be array of string',
  MENTIONS_MUST_BE_ARRAY_OF_OBJECTID: 'Mentions must be array of ObjectId',
  CONTENT_IS_REQUIRED: 'Content is required',
  CONTENT_MUST_BE_STRING: 'Content must be string',
  INVALID_PARENT_ID: 'Invalid parent id',
  PARENT_ID_MUST_BE_NULL: 'Parent id must be null',
  MEDIAS_MUST_BE_ARRAY_OF_MEDIA_OBJECT: 'Medias must be array of media object',
  CREATE_TWEET_SUCCESSFUL: 'Create tweet successful',
  GET_TWEET_SUCCESSFUL: 'Get tweet successful',
  GET_TWEET_CHILDREN_SUCCESSFUL: 'Get tweet children successful',
  IVALID_TWEET_ID: 'Invalid tweet id',
  TWEET_NOT_FOUND: 'Tweet not found',
  TWEET_IS_PRIVATE: 'Tweet is private',
  IVALID_PAGE_NUMBER: 'Page number must be greater than 0',
  IVALID_PAGE_SIZE: 'Page size must be from 1 to 100',
  GET_NEW_FEEDS_SUCCESSFUL: 'Get new feeds successful'
}

export const BOOKMARK_MESSAGE = {
  BOOKMARK_NOT_EXIST: 'Bookmark not exist',
  CREATE_BOOKMARK_SUCCESSFUL: 'Create bookmark successful',
  DELETE_BOOKMARK_SUCCESSFUL: 'Delete bookmark successful'
}

export const LIKE_MESSAGE = {
  LIKE_NOT_EXIST: 'Like not exist',
  CREATE_LIKE_SUCCESSFUL: 'Create like successful',
  DELETE_LIKE_SUCCESSFUL: 'Delete like successful'
}
