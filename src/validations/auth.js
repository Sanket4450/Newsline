const joi = require('joi')

const {
  emailValidation,
  passwordValidation,
  booleanValidation,
  stringValidation,
  otpValidation,
  stringReqValidation,
} = require('./common')

const register = {
  body: joi.object({
    email: emailValidation,
    password: passwordValidation,
    isAdmin: booleanValidation,
    secret: stringValidation,
  }),
}

const login = {
  body: joi.object({
    email: emailValidation,
    password: passwordValidation,
  }),
}

const forgotPassword = {
  body: joi.object({
    email: emailValidation,
  }),
}

const verifyResetPasswordOtp = {
  body: joi.object({
    otp: otpValidation,
    resetToken: stringReqValidation,
  }),
}

module.exports = {
  register,
  login,
  forgotPassword,
  verifyResetPasswordOtp,
}
