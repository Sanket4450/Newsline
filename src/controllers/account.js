const httpStatus = require('http-status')
const catchAsyncErrors = require('../utils/catchAsyncErrors')
const sendResponse = require('../utils/responseHandler')
const messages = require('../constants/messages')
const {
  authService,
  tokenService,
  sessionService,
  accountService,
} = require('../services')

exports.getAccount = catchAsyncErrors(async (req, res) => {
  const accountId = req.user.sub

  const account = await accountService.checkAccountExistById(accountId, {
    fullName: 1,
    userName: 1,
    email: 1,
    mobile: 1,
    dateOfBirth: 1,
    gender: 1,
    country: 1,
    bio: 1,
    website: 1,
    language: 1,
    isVerified: 1,
    _id: 0,
  })

  return sendResponse(
    res,
    httpStatus.OK,
    { account },
    messages.SUCCESS.ACCOUNT_FETCHED
  )
})
