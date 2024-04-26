const userRouter = require('express').Router()
const validate = require('../middlewares/validate')
const { authChecker } = require('../middlewares/auth')
const { rootController } = require('../controllers')

userRouter.get(
  '/',
  authChecker,
  rootController.getHomeData
)

module.exports = { userRouter }
