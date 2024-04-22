const httpStatus = require('http-status')
const folders = require('../constants/folders')
const fields = require('../constants/fields')
const catchAsyncErrors = require('../utils/catchAsyncErrors')
const sendResponse = require('../utils/responseHandler')
const messages = require('../constants/messages')
const { accountService, fileService, authService } = require('../services')

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

  return sendResponse(res, httpStatus.OK, { account }, messages.SUCCESS.ACCOUNT_FETCHED)
})

exports.createAccount = catchAsyncErrors(async (req, res) => {
  const accountId = req.user.sub

  const file = req.file
  const body = req.body

  await accountService.checkAccountExistById(accountId)

  if (body.mobile) {
    await authService.checkAccountNotExistWithMobile(body.mobile)
  }

  const profileImageKey = await fileService.handleFile(file, folders.USER)

  body.profileImageKey = profileImageKey

  await accountService.updateAccountById(accountId, body)

  return sendResponse(res, httpStatus.OK, {}, messages.SUCCESS.ACCOUNT_CREATED)
})
