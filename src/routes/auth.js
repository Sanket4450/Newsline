const router = require('express').Router()
const validate = require('../middlewares/validate')
const { authValidation } = require('../validations')
const { authController } = require('../controllers')

router.post(
  '/register',
  validate(authValidation.register),
  authController.register
)

router.post(
  '/login',
  validate(authValidation.login),
  authController.login
)

router.post(
  '/forgot-password',
  validate(authValidation.forgotPassword),
  authController.forgotPassword
)

router.post(
  '/verify-reset-password-otp',
  validate(authValidation.verifyResetPasswordOtp),
  authController.verifyResetPasswordOtp
)

module.exports = router
