const httpStatus = require('http-status')
const { catchAsyncErrors } = require('../utils/catchAsyncErrors')
const { sendResponse } = require('../utils/responseHandler')
const messages = require('../constants/messages')
const {
  storyService,
  topicService,
  storageService,
  notificationService,
  accountService,
  tagService,
} = require('../services')
const { getObjectId } = require('../utils/getObjectId')

exports.getHomeData = catchAsyncErrors(async (req, res) => {
  const accountId = req.user.accountId
  let topics = await topicService.getAllTopics({ title: 1 })

  let trendingStories = await storyService.getStories({
    sortBy: 'trending',
    limit: 10,
  })

  let recentStories = await storyService.getStories({
    sortBy: 'latest',
    limit: 30,
    shouldTopicIncluded: true,
  })

  const newNotifications = Boolean(
    await notificationService.getNotification({ accountId, isRead: false })
  )

  topics = topics.map((topic) => ({
    id: String(topic._id),
    title: topic.title,
  }))

  trendingStories = await Promise.all(
    trendingStories.map(async (story) => {
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

  recentStories = await Promise.all(
    recentStories.map(async (story) => {
      story.coverImageUrl = story.coverImageKey
        ? await storageService.getFileUrl(story.coverImageKey)
        : null

      story.topic.id = String(story.topic.id)

      story.account.profileImageUrl = story.account.profileImageKey
        ? await storageService.getFileUrl(story.account.profileImageKey)
        : null

      delete story.coverImageKey
      delete story.account.profileImageKey

      return story
    })
  )

  return sendResponse(
    res,
    httpStatus.OK,
    { topics, trendingStories, recentStories, newNotifications },
    messages.SUCCESS.HOME_DATA_FETCHED
  )
})

exports.getDiscoverData = catchAsyncErrors(async (req, res) => {
  const accountId = req.user.accountId

  const { followingAccounts } = accountService.checkAccountExistById(
    accountId,
    {
      followingAccounts: 1,
      _id: 0,
    }
  )

  let publishers = await accountService.getAccountsWithFilter(
    {
      userType: 'publisher',
      sortBy: 'popular',
      limit: 10,
    },
    {
      _id: { $ne: getObjectId(accountId) },
    }
  )

  let authors = await accountService.getAccountsWithFilter(
    {
      userType: 'author',
      sortBy: 'popular',
      limit: 10,
    },
    {
      _id: { $ne: getObjectId(accountId) },
    }
  )

  publishers = await Promise.all(
    publishers.map(async (publisher) => ({
      id: String(publisher.id),
      fullName: publisher.fullName,
      profileImageUrl: publisher.profileImageKey
        ? await storageService.getFileUrl(publisher.profileImageKey)
        : null,
    }))
  )

  publishers = await accountService.validateFollowedAccounts(
    accountId,
    publishers
  )

  authors = await Promise.all(
    authors.map(async (author) => ({
      id: String(author.id),
      fullName: author.fullName,
      profileImageUrl: author.profileImageKey
        ? await storageService.getFileUrl(author.profileImageKey)
        : null,
    }))
  )

  authors = await accountService.validateFollowedAccounts(accountId, authors)

  const currentTimestamp = Date.now()

  let weekTopStories = await storyService.getStories({
    bottomTimestamp: new Date(currentTimestamp - 7 * 24 * 60 * 60 * 1000),
    sortBy: 'trending',
    limit: 10,
  })

  let recommendedStories = await storyService.getStories({
    inclusiveAccounts: followingAccounts,
    sortBy: 'latest',
    limit: 10,
  })

  if (weekTopStories.length < 10) {
    const additionalStories = await storyService.getStories({
      topTimestamp: new Date(currentTimestamp - 7 * 24 * 60 * 60 * 1000),
      sortBy: 'latest',
      limit: 10 - weekTopStories.length,
    })

    weekTopStories = weekTopStories.concat(additionalStories)
  }

  if (recommendedStories.length < 10) {
    const additionalStories = await storyService.getStories({
      exclusiveAccounts: followingAccounts,
      sortBy: 'latest',
      limit: 10 - recommendedStories.length,
    })

    recommendedStories = recommendedStories.concat(additionalStories)
  }

  weekTopStories = await Promise.all(
    weekTopStories.map(async (story) => {
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

  recommendedStories = await Promise.all(
    recommendedStories.map(async (story) => {
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

  return sendResponse(
    res,
    httpStatus.OK,
    { publishers, authors, weekTopStories, recommendedStories },
    messages.SUCCESS.HOME_DATA_FETCHED
  )
})

exports.getSearchResults = catchAsyncErrors(async (req, res) => {
  const accountId = req.user.accountId
  const { search, type, page, limit } = req.body

  let results

  switch (type) {
    case 'stories':
      {
        results = await storyService.getStories({
          search,
          sortBy: 'trending',
          page,
          limit,
        })

        results = await Promise.all(
          results.map(async (story) => {
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
      }
      break

    case 'accounts':
      {
        results = await accountService.getAccountsWithFilter(
          { search, sortBy: 'popular', page, limit },
          {
            type: {
              $in: ['publisher', 'author'],
            },
            _id: { $ne: getObjectId(accountId) },
          }
        )

        results = await Promise.all(
          results.map(async (account) => ({
            id: String(account.id),
            fullName: account.fullName,
            userName: account.userName,
            isVerified: account.isVerified,
            profileImageUrl: account.profileImageKey
              ? await storageService.getFileUrl(account.profileImageKey)
              : null,
          }))
        )

        results = await accountService.validateFollowedAccounts(
          accountId,
          results
        )
      }
      break

    case 'tags': {
      results = await tagService.getTags({ search, page, limit })

      results = await Promise.all(
        results.map(async (tag) => ({
          id: String(tag._id),
          title: tag.title,
          postsCount: tag.postsCount,
        }))
      )

      results = await accountService.validateFollowedTags(accountId, results)
    }
  }

  return sendResponse(
    res,
    httpStatus.OK,
    results,
    messages.SUCCESS.SEARCH_DATA_FETCHED
  )
})
