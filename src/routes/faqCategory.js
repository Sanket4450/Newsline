const userRouter = require('express').Router()
const adminRouter = require('express').Router()
const validate = require('../middlewares/validate')
const { authChecker, authorizeRole } = require('../middlewares/auth')
const { faqCategoryValidation } = require('../validations')
const { faqCategoryController } = require('../controllers')

userRouter.get('/', authChecker, faqCategoryController.getFaqCategories)

adminRouter.post(
  '/',
  authChecker,
  authorizeRole('admin'),
  validate(faqCategoryValidation.createFaqCategory),
  faqCategoryController.createFaqCategory
)

adminRouter.put(
  '/',
  authChecker,
  authorizeRole('admin'),
  validate(faqCategoryValidation.updateFaqCategory),
  faqCategoryController.updateFaqCategory
)

adminRouter.delete(
  '/',
  authChecker,
  authorizeRole('admin'),
  validate(faqCategoryValidation.deleteFaqCategory),
  faqCategoryController.deleteFaqCategory
)

module.exports = { userRouter, adminRouter }
