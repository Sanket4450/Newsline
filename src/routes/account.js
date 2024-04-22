const userRouter = require('express').Router()
const fields = require('../constants/fields')
const validate = require('../middlewares/validate')
const { authChecker } = require('../middlewares/auth')
const { uploadFile } = require('../middlewares/multer')
const { accountValidation } = require('../validations')
const { accountController } = require('../controllers')

userRouter.get('/', authChecker, accountController.getAccount)

userRouter.post(
  '/',
  authChecker,
  uploadFile(fields.PROFILE),
  validate(accountValidation.setAccount),
  accountController.setAccount
)

userRouter.put(
  '/',
  authChecker,
  uploadFile(fields.PROFILE),
  validate(accountValidation.updateAccount),
  accountController.updateAccount
)

module.exports = { userRouter }
