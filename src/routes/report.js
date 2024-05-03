const userRouter = require('express').Router()
const adminRouter = require('express').Router()
const validate = require('../middlewares/validate')
const { authChecker, authorizeRole } = require('../middlewares/auth')
const { reportValidation } = require('../validations')
const { reportController } = require('../controllers')

userRouter.post(
  '/',
  authChecker,
  validate(reportValidation.reportStory),
  reportController.reportStory
)

// adminRouter.get(
//   '/',
//   authChecker,
//   authorizeRole('admin'),
//   reportValidation.getReports,
//   reportController.getReports
// )

adminRouter.delete(
  '/',
  authChecker,
  authorizeRole('admin'),
  validate(reportValidation.deleteReport),
  reportController.deleteReport
)

module.exports = { userRouter, adminRouter }
