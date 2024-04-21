const router = require('express').Router()
const fields = require('../constants/fields')
const validate = require('../middlewares/validate')
const { authChecker } = require('../middlewares/auth')
const { uploadFile } = require('../middlewares/multer')
const { accountValidation } = require('../validations')
const { accountController } = require('../controllers')

router.get('/', authChecker, accountController.getAccount)

router.post(
  '/',
  authChecker,
  uploadFile(fields.PROFILE),
  validate(accountValidation.createAccount),
  accountController.createAccount
)

module.exports = router
