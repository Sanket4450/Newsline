const userRouter = require('express').Router()
const adminRouter = require('express').Router()
const validate = require('../middlewares/validate')
const { authChecker } = require('../middlewares/auth')
const { tagValidation } = require('../validations')
const { tagController } = require('../controllers')

userRouter.post(
  '/filter',
  authChecker,
  validate(tagValidation.getSearchTags),
  tagController.getSearchTags
)

userRouter.patch(
  '/toggle-follow',
  authChecker,
  validate(tagValidation.toggleFollow),
  tagController.toggleFollow
)

module.exports = { userRouter, adminRouter }
