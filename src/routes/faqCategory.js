const userRouter = require('express').Router()
const adminRouter = require('express').Router()
const fields = require('../constants/fields')
const validate = require('../middlewares/validate')
const { authChecker, authorizeRole } = require('../middlewares/auth')
const { faqCategoryValidation } = require('../validations')
const { faqCategoryController } = require('../controllers')

userRouter.get('/',authChecker,faqCategoryController.findCategory)

adminRouter.post(
  '/',
  authChecker,
  authorizeRole('admin'),
  validate(faqCategoryValidation.createCategory),
  faqCategoryController.createCategory
)

adminRouter.delete(
  '/',
  authChecker,
  authorizeRole('admin'),
  validate(faqCategoryValidation.deleteCategory),
  faqCategoryController.deleteCategory
)

adminRouter.put(
  '/',
  authChecker,
  authorizeRole('admin'),
  validate(faqCategoryValidation.updateCategory),
  faqCategoryController.updateCategory
)

module.exports = { userRouter, adminRouter }
