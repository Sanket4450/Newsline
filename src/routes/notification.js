const userRouter = require('express').Router()
const fields = require('../constants/fields')
const validate = require('../middlewares/validate')
const { authChecker, authorizeRole } = require('../middlewares/auth')
const { uploadFile } = require('../middlewares/multer')
const { notificationsValidation } = require('../validations')
const { notificationController } = require('../controllers')

userRouter.get('/', authChecker, notificationController.getNotifications)

userRouter.delete(
  '/:notificationId',
  authChecker,
  validate(notificationsValidation.deleteNotification),
  notificationController.deleteNotification
)

userRouter.delete(
  '/',
  authChecker,
  notificationController.deleteAllNotifications
)

userRouter.put(
  '/',
  authChecker,
  validate(notificationsValidation.deleteNotification),
  notificationController.updateNotification
)

module.exports = { userRouter }
