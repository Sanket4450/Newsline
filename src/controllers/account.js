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
  storageService,
} = require('../services')

exports.getAccount = catchAsyncErrors(async (req, res) => {
  const accountId = req.user.accountId

  const account = await accountService.getAccountById(accountId, {
    fullName: 1,
    userName: 1,
    profileImageKey: 1,
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

  account._doc.profileImageUrl = account.profileImageKey
    ? await storageService.getFileUrl(account.profileImageKey)
    : null

  delete account._doc.profileImageKey

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

  const account = await accountService.getAccountById(accountId, {
    fullName: 1,
    userName: 1,
    profileImageKey: 1,
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

  account._doc.profileImageUrl = account.profileImageKey
    ? await storageService.getFileUrl(account.profileImageKey)
    : null

  delete account._doc.profileImageKey

  return sendResponse(
    res,
    httpStatus.OK,
    { account },
    messages.SUCCESS.ACCOUNT_UPDATED
  )
})

exports.getInterests = catchAsyncErrors(async (req, res) => {
  const accountId = req.user.accountId
  let interests

  interests = await topicService.validateSelectedInterests(accountId)
  interests = await topicService.addFileUrls(interests)

  return sendResponse(
    res,
    httpStatus.OK,
    { interests },
    messages.SUCCESS.INTERESTS_FETCHED
  )
})

exports.setInterests = catchAsyncErrors(async (req, res) => {
  const accountId = req.user.accountId
  const { selectedInterests } = req.body

  const updatedInterests = removeDuplicates(selectedInterests)

  for (let topicId of updatedInterests) {
    await topicService.checkTopicExistById(topicId)
    topicId = getObjectId(topicId)
  }

  await accountService.updateAccountById(accountId, {
    interests: updatedInterests,
  })

  let interests

  interests = await topicService.validateSelectedInterests(accountId)
  interests = await topicService.addFileUrls(interests)

  return sendResponse(
    res,
    httpStatus.OK,
    { interests },
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

  publishers = await accountService.addPublishersFileUrls(publishers)

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

exports.getAdminAccounts = catchAsyncErrors(async (req, res) => {
  let accounts = await accountService.getAccountsWithFilter(req.body)

  accounts = await accountService.addAccountsFileUrls(accounts)

  return sendResponse(
    res,
    httpStatus.OK,
    { accounts },
    messages.SUCCESS.ACCOUNTS_FETCHED
  )
})

exports.updateUserType = catchAsyncErrors(async (req, res) => {
  const { accountId, userType } = req.body

  await accountService.checkAccountExistById(accountId)

  const updateData = {
    type: userType,
    isVerified: userType === 'publisher',
  }

  await accountService.updateAccountById(accountId, updateData)

  return sendResponse(
    res,
    httpStatus.OK,
    { userType },
    `User type is updated to ${userType}`
  )
})
