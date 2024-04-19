const userRouter = require('express').Router()
const adminRouter = require('express').Router()

const authRouter = require('./auth')
const accountRouter = require('./account')

userRouter.use('/auth', authRouter)
userRouter.use('/account', accountRouter)

module.exports = {
  userRouter,
  adminRouter,
}
