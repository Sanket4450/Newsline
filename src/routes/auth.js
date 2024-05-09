const userRouter = require('express').Router()
const validate = require('../middlewares/validate')
const { authValidation } = require('../validations')
const { authController } = require('../controllers')

userRouter.post(
  '/register',
  validate(authValidation.register),
  authController.register
)

userRouter.post(
  '/resend-register-otp',
  validate(authValidation.resendRegisterOtp),
  authController.resendRegisterOtp
)

userRouter.post(
  '/verify-register-otp',
  validate(authValidation.verifyRegisterOtp),
  authController.verifyRegisterOtp
)

userRouter.post('/login', validate(authValidation.login), authController.login)

userRouter.post('/forgot-password',validate(authValidation.forgotPassword),authController.forgotPassword)

userRouter.post(
  '/verify-reset-password-otp',
  validate(authValidation.verifyResetPasswordOtp),
  authController.verifyResetPasswordOtp
)

userRouter.post(
  '/reset-password',
  validate(authValidation.resetPassword),
  authController.resetPassword
)

module.exports = { userRouter }
