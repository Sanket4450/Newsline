const router = require('express').Router()
const validate = require('../middlewares/validate')
const { authChecker } = require('../middlewares/auth')
const { accountValidation } = require('../validations')
const { accountController } = require('../controllers')

router.get(
  '/',
  authChecker,
  accountController.getAccount
)

module.exports = router
