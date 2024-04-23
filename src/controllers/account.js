const httpStatus = require('http-status')
const folders = require('../constants/folders')
const { catchAsyncErrors } = require('../utils/catchAsyncErrors')
const { sendResponse } = require('../utils/responseHandler')
const messages = require('../constants/messages')
const { getObjectId } = require('../utils/getObjectId')
const { removeDuplicates } = require('../utils/removeDuplicates')
const {
  accountService,
  fileService,
  authService,
  topicService,
} = require('../services')

exports.getAccount = catchAsyncErrors(async (req, res) => {
  const accountId = req.user.accountId

  const account = await accountService.getAccountById(accountId, {
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

exports.setAccount = catchAsyncErrors(async (req, res) => {
  const accountId = req.user.accountId

  const file = req.file
  const body = req.body

  await authService.checkAccountNotExistWithUserName(body.userName)

  if (body.mobile) {
    await authService.checkAccountNotExistWithMobile(body.mobile)
  }

  const profileImageKey = await fileService.handleFile(file, folders.USER)

  body.profileImageKey = profileImageKey
  body.isProfileCompleted = true

  await accountService.updateAccountById(accountId, body)

  return sendResponse(res, httpStatus.OK, {}, messages.SUCCESS.ACCOUNT_CREATED)
})

exports.updateAccount = catchAsyncErrors(async (req, res) => {
  const accountId = req.user.accountId

  const file = req.file
  const body = req.body

  if (body.userName) {
    await authService.checkAccountNotExistWithUserName(body.userName, accountId)
  }

  if (body.mobile) {
    await authService.checkAccountNotExistWithMobile(body.mobile, accountId)
  }

  if (file) {
    const profileImageKey = await fileService.handleFile(file, folders.USER)
    body.profileImageKey = profileImageKey
  }

  await accountService.updateAccountById(accountId, body)

  return sendResponse(res, httpStatus.OK, {}, messages.SUCCESS.ACCOUNT_UPDATED)
})

exports.setInterests = catchAsyncErrors(async (req, res) => {
  const accountId = req.user.accountId
  const { selectedInterests } = req.body

  const interests = removeDuplicates(selectedInterests)

  for (let topicId of interests) {
    await topicService.checkTopicExistById(topicId)
    topicId = getObjectId(topicId)
  }

  await accountService.updateAccountById(accountId, { interests })

  return sendResponse(
    res,
    httpStatus.OK,
    {},
    messages.SUCCESS.INTERESTS_SELECTED
  )
})

exports.getPublishers = catchAsyncErrors(async (req, res) => {
  const accountId = req.user.accountId

  let publishers = await accountService.getAccounts(
    { type: 'publisher' },
    { profileImageKey: 1, fullName: 1 }
  )

  publishers = await accountService.validateFollowedAccounts(
    accountId,
    publishers
  )

  publishers = await accountService.addFileUrls(publishers)

  return sendResponse(
    res,
    httpStatus.OK,
    { publishers },
    messages.SUCCESS.PUBLISHERS_FETCHED
  )
})

exports.toggleFollow = catchAsyncErrors(async (req, res) => {
  const followerAccountId = req.user.accountId
  const { accountId: followingAccountId, isFollowed } = req.body

  await accountService.checkAccountExistById(followingAccountId)

  await accountService.toggleFollow(
    followerAccountId,
    followingAccountId,
    isFollowed
  )

  return sendResponse(
    res,
    httpStatus.OK,
    { isFollowed },
    `Account ${isFollowed ? 'Followed' : 'Unfollowed'} successfully`
  )
})
