const messages = {
  ERROR: {
    ACCOUNT_EXISTS_WITH_EMAIL: 'Account already exists with this email',
    ACCOUNT_EXISTS_WITH_USERNAME: 'Account already exists with this User name',
    ACCOUNT_EXISTS_WITH_MOBILE:
      'Account already exists with this mobile number',
    ACCOUNT_NOT_EXIST_WITH_EMAIL: 'Account does not exist with this email',
    INCORRECT_PASSWORD: 'Incorrect password',
    ACCOUNT_NOT_FOUND: 'Account not found',
    INVALID_SECRET: 'Invalid Admin secret',
    ERROR_SENDING_MAIL: 'Error sending mail',
    INVALID_REGISTER_OTP: 'Invalid registeration OTP',
    EMAIL_NOT_VERIFIED: 'Email is not verified',
    INVALID_RESET_PASSWORD_OTP: 'Invalid reset password OTP',
    SOMETHING_WENT_WRONG: 'Something went wrong, please try again',
    INVALID_TOKEN: 'Invalid token or signature',
    TOKEN_EXPIRED: 'Token expired',
    SESSION_NOT_FOUND: 'Session not found',
    LIMIT_FILE_COUNT: 'One file is allowed to be uploaded',
    LIMIT_UNEXPECTED_FILE: 'Incorrect upload field name',
    LIMIT_PART_COUNT: 'Upload rejected: upload form has too many parts',
    LIMIT_FIELD_KEY:
      'Upload rejected: upload field name for the files is too long',
    LIMIT_FIELD_VALUE: 'Upload rejected: upload field is too long',
    LIMIT_FIELD_COUNT: 'Upload rejected: too many fields',
    FILE_NOT_PROVIDED: 'Upload file is not provided',
    FILE_TYPE_NOT_SUPPORTED: 'File type not supported',
    NOT_ALLOWED: 'Not allowed to do this action',
    TOPIC_NOT_FOUND: 'Topic not found',
    ROUTE_NOT_FOUND: 'Route not found',
    TOPIC_EXISTS_WITH_TITLE: 'Topic already exists with this title',
    TAG_NOT_FOUND: 'Tag not found',
    INVALID_JSON: 'Invalid JSON, please provide valid JSON form-data',
    NOT_ALLOWED_TO_POST_STORY: 'Your account is not allowed to post a story',
  },
  SUCCESS: {
    REGISTER_OTP_SENT: 'Registration OTP sent to your email',
    ACCOUNT_REGISTERED: 'Account registered successfully',
    ACCOUNT_LOGGED_IN: 'Account logged in successfully',
    PASSWORD_RESET_OTP_SENT: 'Password reset OTP sent to your email',
    PASSWORD_RESET_OTP_VERIFIED: 'Password reset OTP verified successfully',
    PASSWORD_RESET: 'Password reset successfully',
    ACCOUNT_CREATED: 'Account created successfully',
    ACCOUNT_FETCHED: 'Account fetched successfully',
    ACCOUNT_UPDATED: 'Account updated successfully',
    INTERESTS_FETCHED: 'Interests fetched successfully',
    TOPIC_CREATED: 'Topic created successfully',
    TOPIC_DELETED: 'Topic deleted successfully',
    PUBLISHERS_FETCHED: 'Publishers fetched successfully',
    INTERESTS_SELECTED: 'Interests selected successfully',
    ACCOUNTS_FETCHED: 'Accounts fetched successfully',
    TOPICS_FETCHED: 'Topics fetched successfully',
    STORY_CREATED: 'Story created successfully',
    HOME_DATA_FETCHED: 'Home data fetched successfully',
  },
  SUBJECT: {
    REGISTER_ACCOUNT: 'Register your account',
    RESET_PASSWORD: 'Reset your password',
  },
}

module.exports = messages
