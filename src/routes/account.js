const userRouter = require('express').Router()
const adminRouter = require('express').Router()
const fields = require('../constants/fields')
const validate = require('../middlewares/validate')
const { authChecker, authorizeRole } = require('../middlewares/auth')
const { uploadFile } = require('../middlewares/multer')
const { accountValidation } = require('../validations')
const { accountController } = require('../controllers')

userRouter.get('/', authChecker, accountController.getAccount)

userRouter.post(
  '/',
  authChecker,
  uploadFile(fields.PROFILE),
  validate(accountValidation.setAccount),
  accountController.setAccount
)

userRouter.put(
  '/',
  authChecker,
  uploadFile(fields.PROFILE),
  validate(accountValidation.updateAccount),
  accountController.updateAccount
)

userRouter.get('/interests', authChecker, accountController.getInterests)

userRouter.put(
  '/interests',
  authChecker,
  validate(accountValidation.setInterests),
  accountController.setInterests
)

userRouter.get('/publishers', authChecker, accountController.getPublishers)

userRouter.patch(
  '/toggle-follow',
  authChecker,
  validate(accountValidation.toggleFollow),
  accountController.toggleFollow
)

userRouter.post(
  '/filter',
  authChecker,
  validate(accountValidation.getSearchAccounts),
  accountController.getSearchAccounts
)

adminRouter.post(
  '/users',
  authChecker,
  authorizeRole('admin'),
  validate(accountValidation.getAdminAccounts),
  accountController.getAdminAccounts
)

adminRouter.patch(
  '/user-type',
  authChecker,
  authorizeRole('admin'),
  validate(accountValidation.updateUserType),
  accountController.updateUserType
)

module.exports = { userRouter, adminRouter }
