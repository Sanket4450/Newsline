const userRouter = require('express').Router()
const adminRouter = require('express').Router()
const fields = require('../constants/fields')
const validate = require('../middlewares/validate')
const { authChecker } = require('../middlewares/auth')
const { uploadFile } = require('../middlewares/multer')
const formatter = require('../middlewares/formatter')
const { storyValidation } = require('../validations')
const { storyController } = require('../controllers')

userRouter.post(
  '/filter',
  authChecker,
  validate(storyValidation.getStories),
  storyController.getStories
)

userRouter.get('/suggested-tags', authChecker, storyController.getSuggestedTags)

userRouter.get(
  '/:storyId',
  authChecker,
  validate(storyValidation.getStory),
  storyController.getStory
)

userRouter.post(
  '/',
  authChecker,
  uploadFile(fields.STORY),
  formatter.createStory,
  validate(storyValidation.createStory),
  storyController.createStory
)

userRouter.put(
  '/',
  authChecker,
  uploadFile(fields.STORY),
  formatter.updateStory,
  validate(storyValidation.updateStory),
  storyController.updateStory
)

userRouter.delete(
  '/',
  authChecker,
  validate(storyValidation.deleteStory),
  storyController.deleteStory
)

module.exports = { userRouter }
