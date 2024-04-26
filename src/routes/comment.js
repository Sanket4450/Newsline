const userRouter = require('express').Router()
const fields = require('../constants/fields')
const validate = require('../middlewares/validate')
const { authChecker } = require('../middlewares/auth')
const { uploadFile } = require('../middlewares/multer')
const formatter = require('../middlewares/formatter')
const { commentValidation } = require('../validations')
const { commentController } = require('../controllers')

userRouter.get(
  '/:storyId',
  authChecker,
  validate(commentValidation.getComments),
  commentController.getComments
)

userRouter.post(
  '/',
  authChecker,
  validate(commentValidation.postComment),
  commentController.postComment
)

module.exports = { userRouter }
