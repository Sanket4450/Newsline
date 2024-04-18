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

module.exports = router
