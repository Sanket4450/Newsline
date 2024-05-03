const userRouter = require('express').Router()
const adminRouter = require('express').Router()
const validate = require('../middlewares/validate')
const { authChecker, authorizeRole } = require('../middlewares/auth')
const { reportReasonValidation } = require('../validations')
const { reportReasonController } = require('../controllers')

userRouter.get('/', authChecker, reportReasonController.getReportReasons)

adminRouter.post(
  '/',
  authChecker,
  authorizeRole('admin'),
  validate(reportReasonValidation.createReportReason),
  reportReasonController.createReportReason
)

adminRouter.put(
  '/',
  authChecker,
  authorizeRole('admin'),
  validate(reportReasonValidation.updateReportReason),
  reportReasonController.updateReportReason
)

adminRouter.delete(
  '/',
  authChecker,
  authorizeRole('admin'),
  validate(reportReasonValidation.deleteReportReason),
  reportReasonController.deleteReportReason
)

module.exports = { userRouter, adminRouter }
