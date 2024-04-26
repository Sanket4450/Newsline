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
const { userRouter: userFaqCategoryRouter, adminRouter: adminFaqCategoryRouter } = require('./faqCategory')
const { userRouter: userFaqRouter, adminRouter: adminFaqRouter } = require('./faq')

userRouter.use('/auth', userAuthRouter)
userRouter.use('/account', userAccountRouter)
userRouter.use('/', userRootRouter)
userRouter.use('/topics', userTopicRouter)
userRouter.use('/stories', userStoryRouter)
userRouter.use('/faqcategory', userFaqCategoryRouter)
userRouter.use('/faq', userFaqRouter)

adminRouter.use('/account', adminAccountRouter)
adminRouter.use('/topics', adminTopicRouter)
adminRouter.use('/faqcategory', adminFaqCategoryRouter)
adminRouter.use('/faq',adminFaqRouter)

module.exports = {
  userRouter,
  adminRouter,
}
