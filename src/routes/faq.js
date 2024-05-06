const userRouter = require('express').Router()
const adminRouter = require('express').Router()
const validate = require('../middlewares/validate')
const { authChecker, authorizeRole } = require('../middlewares/auth')
const { faqValidation } = require('../validations')
const { faqController } = require('../controllers')

userRouter.post(
  '/filter',
  authChecker,
  validate(faqValidation.getFaqs),
  faqController.getFaqs
)

adminRouter.post(
  '/',
  authChecker,
  authorizeRole('admin'),
  validate(faqValidation.createFaq),
  faqController.createFaq
)

adminRouter.put(
  '/',
  authChecker,
  authorizeRole('admin'),
  validate(faqValidation.updateFaq),
  faqController.updateFaq
)

adminRouter.delete(
  '/',
  authChecker,
  authorizeRole('admin'),
  validate(faqValidation.deleteFaq),
  faqController.deleteFaq
)

module.exports = { userRouter, adminRouter }
