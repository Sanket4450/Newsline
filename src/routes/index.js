const userRouter = require('express').Router()
const adminRouter = require('express').Router()

const authRouter = require('./auth')
const accountRouter = require('./account')
const { userRouter, adminRouter } = require('./topic')

userRouter.use('/auth', authRouter)
userRouter.use('/account', accountRouter)
userRouter.use('/topics', topicRouter)

module.exports = {
  userRouter,
  adminRouter,
}
