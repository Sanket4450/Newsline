const httpStatus = require('http-status');
const { catchAsyncErrors } = require('../utils/catchAsyncErrors');
const { sendResponse } = require('../utils/responseHandler');
const messages = require('../constants/messages');
const {
  storyService,
  topicService,
  storageService,
  notificationService,
} = require('../services')

exports.getHomeData = catchAsyncErrors(async (req, res) => {
  const accountId = req.user.accountId
  let topics = await topicService.getAllTopics({ title: 1 })

  let { trendingStories, recentStories } = await storyService.getHomeStories()

  const newNotifications = Boolean(
    await notificationService.getNotification({ accountId, isRead: false })
  )

  topics = topics.map((topic) => ({
    id: String(topic._id),
    title: topic.title,
  }))

  trendingStories = await Promise.all(
    trendingStories.map(async (story) => ({
      id: String(story.id),
      title: story.title,
      description: story.description,
      coverImageUrl: story.coverImageKey
        ? await storageService.getFileUrl(story.coverImageKey)
        : null,
      views: story.views,
      createdAt: story.createdAt,
      topic: {
        id: String(story.topic.id),
        title: story.topic.title,
      },
      account: {
        fullName: story.account.fullName,
        profileImageUrl: story.account.profileImageKey
          ? await storageService.getFileUrl(story.account.profileImageKey)
          : null,
      },
    }))
  )

  recentStories = await Promise.all(
    recentStories.map(async (story) => ({
      id: String(story.id),
      title: story.title,
      description: story.description,
      coverImageUrl: story.coverImageKey
        ? await storageService.getFileUrl(story.coverImageKey)
        : null,
      views: story.views,
      createdAt: story.createdAt,
      topic: {
        id: String(story.topic.id),
        title: story.topic.title,
      },
      account: {
        fullName: story.account.fullName,
        profileImageUrl: story.account.profileImageKey
          ? await storageService.getFileUrl(story.account.profileImageKey)
          : null,
      },
    }))
  )

  return sendResponse(
    res,
    httpStatus.OK,
    { topics, trendingStories, recentStories, newNotifications },
    messages.SUCCESS.HOME_DATA_FETCHED
  )
})
