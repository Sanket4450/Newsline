const userRouter = require('express').Router()
const validate = require('../middlewares/validate')
const { authChecker } = require('../middlewares/auth')
const { rootController } = require('../controllers')

userRouter.get(
  '/home',
  authChecker,
  rootController.getHomeData
)

userRouter.get('/discover', authChecker, rootController.getDiscoverData)

module.exports = { userRouter }
