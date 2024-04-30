const userRouter = require('express').Router()
const adminRouter = require('express').Router()

const { userRouter: userAuthRouter } = require('./auth')
const {
  userRouter: userAccountRouter,
  adminRouter: adminAccountRouter,
} = require('./account')
const { userRouter: userRootRouter } = require('./root')
const { userRouter: userNotificationRouter } = require('./notification')
const {
  userRouter: userTopicRouter,
  adminRouter: adminTopicRouter,
} = require('./topic')
const { userRouter: userStoryRouter } = require('./story')
const {
  userRouter: userFaqCategoryRouter,
  adminRouter: adminFaqCategoryRouter,
} = require('./faqCategory')
const {
  userRouter: userFaqRouter,
  adminRouter: adminFaqRouter,
} = require('./faq')
const { userRouter: userCommentRouter } = require('./comment')
const { userRouter: userbookmarkCollectionRouter} = require('./bookmark')
const { userRouter: userTagRouter} = require('./tag')

userRouter.use('/auth', userAuthRouter)
userRouter.use('/account', userAccountRouter)
userRouter.use('/', userRootRouter)
userRouter.use('/notifications', userNotificationRouter)
userRouter.use('/topics', userTopicRouter)
userRouter.use('/stories', userStoryRouter)
userRouter.use('/faq-categories', userFaqCategoryRouter)
userRouter.use('/faqs', userFaqRouter)
userRouter.use('/comments', userCommentRouter)
userRouter.use('/bookmark-collections', userbookmarkCollectionRouter)
userRouter.use('/tags', userTagRouter)

adminRouter.use('/account', adminAccountRouter)
adminRouter.use('/topics', adminTopicRouter)
adminRouter.use('/faq-categories', adminFaqCategoryRouter)
adminRouter.use('/faqs', adminFaqRouter)

module.exports = {
  userRouter,
  adminRouter,
}
