const httpStatus = require('http-status')
const { catchAsyncErrors } = require('../utils/catchAsyncErrors')
const { sendResponse } = require('../utils/responseHandler')
const messages = require('../constants/messages')
const {
  storyService,
  topicService,
  storageService,
  notificationService,
} = require('../services')

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
