const userRouter = require('express').Router()
const adminRouter = require('express').Router()
const validate = require('../middlewares/validate')
const { authChecker, authorizeRole } = require('../middlewares/auth')
const { bookmarkValidation } = require('../validations')
const { bookmarkController } = require('../controllers')

userRouter.get('/', authChecker, bookmarkController.findBookmarkCollection)

userRouter.post(
  '/',
  authChecker,
  validate(bookmarkValidation.createBookmarkCollection),
  bookmarkController.createBookmarkCollection
)

userRouter.delete(
  '/',
  authChecker,
  validate(bookmarkValidation.deleteBookmarkCollection),
  bookmarkController.deleteBookmarkCollection
)

userRouter.patch(
  '/addstory',
  authChecker,
  validate(bookmarkValidation.addStoryBookmarkCollection),
  bookmarkController.addStoryBookmarkCollection
)

userRouter.get(
  '/story',
  authChecker,
  bookmarkController.getStoryBookmarkCollection
)

module.exports = { userRouter, adminRouter }
