const userRouter = require('express').Router()
const adminRouter = require('express').Router()
const fields = require('../constants/fields')
const validate = require('../middlewares/validate')
const { authChecker, authorizeRole } = require('../middlewares/auth')
const { bookmarkCollectionValidation } = require('../validations')
const { bookmarkCollectionController } = require('../controllers')

userRouter.get('/',authChecker,bookmarkCollectionController.findBookmarkCollection)

userRouter.post(
  '/',
  authChecker,
  validate(bookmarkCollectionValidation.createBookmarkCollection),
  bookmarkCollectionController.createBookmarkCollection
)

userRouter.delete(
  '/',
  authChecker,
  validate(bookmarkCollectionValidation.deleteBookmarkCollection),
  bookmarkCollectionController.deleteBookmarkCollection
)

userRouter.patch(
  '/addstory',
  authChecker,
  validate(bookmarkCollectionValidation.addStoryBookmarkCollection),
  bookmarkCollectionController.addStoryBookmarkCollection
)

userRouter.get('/story',authChecker,bookmarkCollectionController.getStoryBookmarkCollection) // didn't complite

module.exports = { userRouter, adminRouter }
