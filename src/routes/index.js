const userRouter = require('express').Router()
const adminRouter = require('express').Router()

const authRouter = require('./auth')

userRouter.use('/auth', authRouter)

module.exports = {
  userRouter,
  adminRouter,
}
