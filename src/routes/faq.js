const userRouter = require('express').Router()
const adminRouter = require('express').Router()
const fields = require('../constants/fields')
const validate = require('../middlewares/validate')
const { authChecker, authorizeRole } = require('../middlewares/auth')
const { faqValidation } = require('../validations')
const { faqController } = require('../controllers')

userRouter.post('/',authChecker,validate(faqValidation.searchCategory),faqController.searchCategory)

adminRouter.post(
  '/',
  authChecker,
  authorizeRole('admin'),
  validate(faqValidation.createTitleCategory),
  faqController.createTitleDescription
)

adminRouter.delete(
  '/',
  authChecker,
  authorizeRole('admin'),
  validate(faqValidation.deleteCategory),
  faqController.deleteTitleDescription
)

adminRouter.put(
  '/',
  authChecker,
  authorizeRole('admin'),
  validate(faqValidation.updateCategory),
  faqController.updateTitleDescription
)

module.exports = { userRouter, adminRouter }
