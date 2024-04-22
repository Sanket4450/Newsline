const userRouter = require('express').Router()
const adminRouter = require('express').Router()

const { userRouter: userAuthRouter } = require('./auth')
const { userRouter: userAccountRouter } = require('./account')
const {
  userRouter: userTopicRouter,
  adminRouter: adminTopicRouter,
} = require('./topic')

userRouter.use('/auth', userAuthRouter)
userRouter.use('/account', userAccountRouter)
userRouter.use('/topics', userTopicRouter)

adminRouter.use('/topics', adminTopicRouter)

module.exports = {
  userRouter,
  adminRouter,
}
