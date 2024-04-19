const messages = {
  ERROR: {
    ACCOUNT_EXISTS_WITH_EMAIL: 'Account already exists with this email',
    ACCOUNT_NOT_EXIST_WITH_EMAIL: 'Account does not exist with this email',
    INCORRECT_PASSWORD: 'Incorrect password',
    ACCOUNT_NOT_FOUND: 'Account not found',
    INVALID_SECRET: 'Invalid Admin secret',
    ERROR_SENDING_MAIL: 'Error sending mail',
    INVALID_RESET_PASSWORD_OTP: 'Invalid reset password OTP',
    SOMETHING_WENT_WRONG: 'Something went wrong, please try again',
    INVALID_TOKEN: 'Invalid token or signature',
    TOKEN_EXPIRED: 'Token expired',
    SESSION_NOT_FOUND: 'Session not found',
    NOT_ALLOWED: 'Not allowed to do this action',
    ROUTE_NOT_FOUND: 'Route not found',
  },
  SUCCESS: {
    ACCOUNT_CREATED: 'Account created successfully',
    ACCOUNT_LOGGED_IN: 'Account logged in successfully',
    PASSWORD_RESET_OTP_SENT: 'Password reset OTP sent to your email',
    PASSWORD_RESET_OTP_VERIFIED: 'Password reset OTP verified successfully',
    PASSWORD_RESET: 'Password reset successfully',
    ACCOUNT_FETCHED: 'Account fetched successfully',
  },
  SUBJECT: {
    RESET_PASSWORD: 'Reset your password',
  },
}

module.exports = messages
