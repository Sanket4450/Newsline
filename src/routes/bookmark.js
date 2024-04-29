const userRouter = require('express').Router()
const adminRouter = require('express').Router()
const validate = require('../middlewares/validate')
const { authChecker } = require('../middlewares/auth')
const { bookmarkValidation } = require('../validations')
const { bookmarkController } = require('../controllers')

userRouter.get(
  '/home',
  authChecker,
  bookmarkController.getBookmarkCollectionsData
)

userRouter.get(
  '/:storyId',
  authChecker,
  validate(bookmarkValidation.getBookmarkCollections),
  bookmarkController.getBookmarkCollections
)

userRouter.get(
  '/stories/:bookmarkCollectionId',
  authChecker,
  validate(bookmarkValidation.getBookmarkStories),
  bookmarkController.getBookmarkStories
)

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

module.exports = { userRouter, adminRouter }
