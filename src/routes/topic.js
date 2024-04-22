const userRouter = require('express').Router()
const adminRouter = require('express').Router()
const fields = require('../constants/fields')
const validate = require('../middlewares/validate')
const { authChecker } = require('../middlewares/auth')
const { uploadFile } = require('../middlewares/multer')
const { accountValidation } = require('../validations')
const { accountController } = require('../controllers')

adminRouter.post(
  '/',
  authChecker,
  uploadFile(fields.PROFILE),
  validate(accountValidation.createAccount),
  accountController.createAccount
)

module.exports = { userRouter, adminRouter }
