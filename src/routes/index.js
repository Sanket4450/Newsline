const userRouter = require('express').Router()
const adminRouter = require('express').Router()

const { userRouter: userAuthRouter } = require('./auth')
const {
  userRouter: userAccountRouter,
  adminRouter: adminAccountRouter,
} = require('./account')
const { userRouter: userRootRouter } = require('./root')
const {
  userRouter: userTopicRouter,
  adminRouter: adminTopicRouter,
} = require('./topic')
const { userRouter: userStoryRouter } = require('./story')
const { userRouter: userCommentRouter } = require('./comment')

userRouter.use('/auth', userAuthRouter)
userRouter.use('/account', userAccountRouter)
userRouter.use('/', userRootRouter)
userRouter.use('/topics', userTopicRouter)
userRouter.use('/stories', userStoryRouter)
userRouter.use('/comments', userCommentRouter)

adminRouter.use('/account', adminAccountRouter)
adminRouter.use('/topics', adminTopicRouter)

module.exports = {
  userRouter,
  adminRouter,
}
