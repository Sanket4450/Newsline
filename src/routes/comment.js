const userRouter = require('express').Router()
const validate = require('../middlewares/validate')
const { authChecker } = require('../middlewares/auth')
const { commentValidation } = require('../validations')
const { commentController } = require('../controllers')

userRouter.post(
  '/filter',
  authChecker,
  validate(commentValidation.getComments),
  commentController.getComments
)

userRouter.post(
  '/',
  authChecker,
  validate(commentValidation.postComment),
  commentController.postComment
)

userRouter.put(
  '/',
  authChecker,
  validate(commentValidation.updateComment),
  commentController.updateComment
)

userRouter.delete(
  '/',
  authChecker,
  validate(commentValidation.deleteComment),
  commentController.deleteComment
)

userRouter.patch(
  '/toggle-like',
  authChecker,
  validate(commentValidation.toggleLike),
  commentController.toggleLike
)

userRouter.get(
  '/replies/:commentId',
  authChecker,
  validate(commentValidation.getReplies),
  commentController.getReplies
)

userRouter.post(
  '/replies',
  authChecker,
  validate(commentValidation.postReply),
  commentController.postReply
)

module.exports = { userRouter }
