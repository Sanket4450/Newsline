const joi = require('joi')

const {
  emailValidation,
  passwordValidation,
  otpValidation,
  stringReqValidation,
  booleanValidation,
} = require('./common')

const register = {
  body: joi.object({
    email: emailValidation,
    password: passwordValidation,
  }),
}

const resendRegisterOtp = {
  body: joi.object({
    email: emailValidation,
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
    isAdmin: booleanValidation,
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
  resendRegisterOtp,
  verifyRegisterOtp,
  login,
  forgotPassword,
  verifyResetPasswordOtp,
  resetPassword,
}
