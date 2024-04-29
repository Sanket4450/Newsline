const userRouter = require('express').Router()
const adminRouter = require('express').Router()
const fields = require('../constants/fields')
const validate = require('../middlewares/validate')
const { authChecker, authorizeRole } = require('../middlewares/auth')
const { uploadFile } = require('../middlewares/multer')
const { topicValidation } = require('../validations')
const { topicController } = require('../controllers')

userRouter.get('/', authChecker, topicController.getTopics)

adminRouter.get('/', authChecker, topicController.getAdminTopics)

adminRouter.post(
  '/',
  authChecker,
  authorizeRole('admin'),
  uploadFile(fields.TOPIC),
  validate(topicValidation.createTopic),
  topicController.createTopic
)

adminRouter.delete(
  '/',
  authChecker,
  authorizeRole('admin'),
  validate(topicValidation.deleteTopic),
  topicController.deleteTopic
)

module.exports = { userRouter, adminRouter }
