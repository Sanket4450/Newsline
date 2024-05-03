const httpStatus = require('http-status')
const folders = require('../constants/folders')
const { catchAsyncErrors } = require('../utils/catchAsyncErrors')
const { sendResponse } = require('../utils/responseHandler')
const ApiError = require('../utils/ApiError')
const messages = require('../constants/messages')
const { getObjectId } = require('../utils/getObjectId')
const { removeDuplicates } = require('../utils/removeDuplicates')
const notifications = require('../constants/notifications')
const {
  accountService,
  fileService,
  authService,
  topicService,
  storageService,
  notificationService,
  storyService,
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
    _id: 1,
  })

  account._doc.profileImageUrl = account.profileImageKey
    ? await storageService.getFileUrl(account.profileImageKey)
    : null

  delete account._doc.profileImageKey
  delete account._doc._id

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

  await notificationService.createNotification(accountId, {
    event: 'setupAccount',
    iconKey: notifications.USER,
    title: messages.NOTIFICATION.ACCOUNT_SETUP,
  })

  return sendResponse(
    res,
    httpStatus.OK,
    { account },
    messages.SUCCESS.ACCOUNT_CREATED
  )
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

  await notificationService.createNotification(accountId, {
    event: 'setupAccount',
    iconKey: notifications.USER,
    title: messages.NOTIFICATION.ACCOUNT_UPDATED,
  })

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

exports.getSearchAccounts = catchAsyncErrors(async (req, res) => {
  const accountId = req.user.accountId
  const search = req.body.search || ''
  const { page, limit } = req.body

  let accounts = await accountService.getAccountsWithFilter(
    { search, page, limit },
    {
      type: {
        $in: ['publisher', 'author'],
      },
      _id: { $ne: getObjectId(accountId) },
    }
  )

  accounts = await Promise.all(
    accounts.map(async (account) => ({
      id: String(account.id),
      fullName: account.fullName,
      userName: account.userName,
      isVerified: account.isVerified,
      profileImageUrl: account.profileImageKey
        ? await storageService.getFileUrl(account.profileImageKey)
        : null,
    }))
  )

  accounts = await accountService.validateFollowedAccounts(accountId, accounts)

  return sendResponse(
    res,
    httpStatus.OK,
    { accounts },
    messages.SUCCESS.ACCOUNTS_FETCHED
  )
})

exports.getPublishers = catchAsyncErrors(async (req, res) => {
  const accountId = req.user.accountId

  let publishers = await accountService.getAccounts(
    { type: 'publisher' },
    { profileImageKey: 1, fullName: 1 }
  )

  publishers = await Promise.all(
    publishers.map(async (account) => ({
      id: String(account._id),
      fullName: account.fullName,
      profileImageUrl: account.profileImageKey
        ? await storageService.getFileUrl(account.profileImageKey)
        : null,
    }))
  )

  publishers = await accountService.validateFollowedAccounts(
    accountId,
    publishers
  )

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

  if (followerAccountId === followingAccountId) {
    throw new ApiError(
      messages.ERROR.CANNOT_FOLLOW_YOURSELF,
      httpStatus.BAD_REQUEST
    )
  }

  await accountService.checkAccountExistById(followingAccountId)

  const notification = await notificationService.getNotification({
    type: 'engage',
    iconAccountId: getObjectId(followerAccountId),
  })
  const existingNotification = await notificationService.getNotification({
    accountId: getObjectId(followerAccountId),
    type: 'engage',
    iconAccountId: getObjectId(followingAccountId),
  })

  await accountService.toggleFollow(
    followerAccountId,
    followingAccountId,
    isFollowed
  )

  const { fullName } = await accountService.getAccountById(followerAccountId, {
    fullName: 1,
  })

  if (isFollowed && !notification) {
    if (existingNotification) {
      await notificationService.createNotification(followingAccountId, {
        type: 'engage',
        event: 'followAccount',
        title: `${fullName} ${messages.NOTIFICATION.STARTED_FOLLOWING}`,
        iconAccountId: getObjectId(followerAccountId),
        isFollowedBack: true,
      })
      await notificationService.updateNotification(
        followerAccountId,
        String(existingNotification._id),
        {
          isFollowedBack: true,
        }
      )
    } else {
      await notificationService.createNotification(followingAccountId, {
        type: 'engage',
        event: 'followAccount',
        title: `${fullName} ${messages.NOTIFICATION.STARTED_FOLLOWING}`,
        iconAccountId: getObjectId(followerAccountId),
        isFollowedBack: false,
      })
    }
  } else if (!isFollowed && notification) {
    await notificationService.deleteNotification(
      followingAccountId,
      String(notification._id)
    )
    existingNotification &&
      (await notificationService.deleteNotification(
        followerAccountId,
        String(existingNotification._id)
      ))
  } else {
  }

  return sendResponse(
    res,
    httpStatus.OK,
    { isFollowed },
    `Account ${isFollowed ? 'Followed' : 'Unfollowed'} successfully`
  )
})

exports.getProfileInfo = catchAsyncErrors(async (req, res) => {
  const accountId = req.user.accountId

  let account = await accountService.checkAccountExistById(accountId, {
    fullName: 1,
    userName: 1,
    profileImageKey: 1,
    bio: 1,
    website: 1,
    isVerified: 1,
    followingAccounts: 1,
  })

  account._doc.id = String(account._id)
  account._doc.profileImageUrl = account.profileImageKey
    ? await storageService.getFileUrl(account.profileImageKey)
    : null

  account._doc.storiesCount = await storyService.getStoriesCount(accountId)
  account._doc.followersCount = await accountService.getFollowersCount(
    accountId
  )
  account._doc.followingsCount = account?.followingAccounts?.length || 0

  delete account._doc.profileImageKey
  delete account._doc._id
  delete account._doc.followingAccounts

  let stories = await storyService.getStories({
    accountId,
    sortBy: 'latest',
    limit: 10,
  })

  stories = await Promise.all(
    stories.map(async (story) => {
      story.coverImageUrl = story.coverImageKey
        ? await storageService.getFileUrl(story.coverImageKey)
        : null

      story.account.profileImageUrl = story.account.profileImageKey
        ? await storageService.getFileUrl(story.account.profileImageKey)
        : null

      delete story.coverImageKey
      delete story.account.profileImageKey

      return story
    })
  )

  const profileInfo = {
    ...account._doc,
    stories,
  }

  return sendResponse(
    res,
    httpStatus.OK,
    { profileInfo },
    messages.SUCCESS.ACCOUNT_INFO_FETCHED
  )
})

exports.getAccountInfo = catchAsyncErrors(async (req, res) => {
  const readerId = req.user.accountId
  const { accountId } = req.params

  if (readerId === accountId) {
    throw new ApiError(
      messages.ERROR.CANNOT_VIEW_YOURSELF,
      httpStatus.BAD_REQUEST
    )
  }

  let account = await accountService.checkAccountExistById(accountId, {
    fullName: 1,
    userName: 1,
    profileImageKey: 1,
    bio: 1,
    website: 1,
    isVerified: 1,
    followingAccounts: 1,
  })

  account._doc.id = String(account._id)
  account._doc.profileImageUrl = account.profileImageKey
    ? await storageService.getFileUrl(account.profileImageKey)
    : null

  account._doc.storiesCount = await storyService.getStoriesCount(accountId)
  account._doc.followersCount = await accountService.getFollowersCount(
    accountId
  )
  account._doc.followingsCount = account?.followingAccounts?.length || 0
  account._doc.isFollowed = Boolean(
    await accountService.getAccount({
      _id: getObjectId(readerId),
      followingAccounts: getObjectId(accountId),
    })
  )

  delete account._doc.profileImageKey
  delete account._doc._id
  delete account._doc.followingAccounts

  let stories = await storyService.getStories({
    accountId,
    sortBy: 'latest',
    limit: 10,
  })

  stories = await Promise.all(
    stories.map(async (story) => {
      story.coverImageUrl = story.coverImageKey
        ? await storageService.getFileUrl(story.coverImageKey)
        : null

      story.account.profileImageUrl = story.account.profileImageKey
        ? await storageService.getFileUrl(story.account.profileImageKey)
        : null

      delete story.coverImageKey
      delete story.account.profileImageKey

      return story
    })
  )

  const accountInfo = {
    ...account._doc,
    stories,
  }

  return sendResponse(
    res,
    httpStatus.OK,
    { accountInfo },
    messages.SUCCESS.ACCOUNT_INFO_FETCHED
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
