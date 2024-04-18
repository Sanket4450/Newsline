const messages = {
  ERROR: {
    ACCOUNT_EXISTS_WITH_EMAIL: 'Account already exists with this email',
    ACCOUNT_NOT_EXIST_WITH_EMAIL: 'Account does not exist with this email',
    INVALID_SECRET: 'Invalid Admin secret',
    ERROR_SENDING_MAIL: 'Error sending mail',
    SOMETHING_WENT_WRONG: 'Something went wrong, please try again',
    INVALID_TOKEN: 'Invalid token or signature',
    TOKEN_EXPIRED: 'Token expired',
    NOT_ALLOWED: 'Not allowed to do this action',
    ROUTE_NOT_FOUND: 'Route not found',
  },
  SUCCESS: {
    ACCOUNT_CREATED: 'Account created successfully',
    ACCOUNT_LOGGED_IN: 'Account logged in successfully',
    PASSWORD_RESET_OTP_SENT: 'Password reset OTP sent to your email',
  },
  SUBJECT: {
    RESET_PASSWORD: 'Reset your password',
  },
}

module.exports = messages
