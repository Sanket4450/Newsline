const userRouter = require('express').Router()
const validate = require('../middlewares/validate')
const { authChecker, authorizeRole } = require('../middlewares/auth')
const { notificationsValidation } = require('../validations')
const { notificationController } = require('../controllers')

userRouter.get('/', authChecker, notificationController.getNotifications)

userRouter.delete(
  '/',
  authChecker,
  validate(notificationsValidation.deleteNotification),
  notificationController.deleteNotification
)

module.exports = { userRouter }
