const userRouter = require('express').Router()
const adminRouter = require('express').Router()
const fields = require('../constants/fields')
const validate = require('../middlewares/validate')
const { authChecker } = require('../middlewares/auth')
const { uploadFile } = require('../middlewares/multer')
const { accountValidation } = require('../validations')
const { accountController } = require('../controllers')

userRouter.post(
  '/',
  authChecker,
  uploadFile(fields.STORY),
  validate(accountValidation.createStory),
  accountController.createStory
)

module.exports = { userRouter, adminRouter }
