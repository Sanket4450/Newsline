const userRouter = require('express').Router()
const adminRouter = require('express').Router()
const fields = require('../constants/fields')
const validate = require('../middlewares/validate')
const { authChecker } = require('../middlewares/auth')
const { uploadFile } = require('../middlewares/multer')
const formatter = require('../middlewares/formatter')
const { storyValidation } = require('../validations')
const { storyController } = require('../controllers')

userRouter.post(
  '/',
  authChecker,
  uploadFile(fields.STORY),
  formatter.createStory,
  validate(storyValidation.createStory),
  storyController.createStory
)

module.exports = { userRouter }
