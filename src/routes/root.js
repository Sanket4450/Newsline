const userRouter = require('express').Router()
const validate = require('../middlewares/validate')
const { authChecker } = require('../middlewares/auth')
const { rootValidation } = require('../validations')
const { rootController } = require('../controllers')

userRouter.get('/home', authChecker, rootController.getHomeData)

userRouter.get('/discover', authChecker, rootController.getDiscoverData)

userRouter.get(
  '/filter',
  authChecker,
  validate(rootValidation.getSearchResults),
  rootController.getSearchResults
)

module.exports = { userRouter }
