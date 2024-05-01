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

userRouter.get(
  '/:tagId',
  authChecker,
  validate(tagValidation.getTagInfo),
  tagController.getTagInfo
)

module.exports = { userRouter, adminRouter }
