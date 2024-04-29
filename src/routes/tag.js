const userRouter = require('express').Router()
const adminRouter = require('express').Router()
const fields = require('../constants/fields')
const validate = require('../middlewares/validate')
const { authChecker, authorizeRole } = require('../middlewares/auth')
const { faqValidation } = require('../validations')
const { tagController } = require('../controllers')

userRouter.get('/searchTags', authChecker, validate(faqValidation.getTagsearch), tagController.getTagSearch)

module.exports = { userRouter, adminRouter }
