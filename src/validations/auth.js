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

const verifyRegisterOtp = {
  body: joi.object({
    otp: otpValidation,
    registerToken: stringReqValidation,
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

const resetPassword = {
  body: joi.object({
    password: passwordValidation,
    resetToken: stringReqValidation,
  }),
}

module.exports = {
  register,
  verifyRegisterOtp,
  login,
  forgotPassword,
  verifyResetPasswordOtp,
  resetPassword,
}
