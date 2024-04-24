const httpStatus = require('http-status')
const folders = require('../constants/folders')
const { catchAsyncErrors } = require('../utils/catchAsyncErrors')
const ApiError = require('../utils/ApiError')
const { sendResponse } = require('../utils/responseHandler')
const messages = require('../constants/messages')
const {
  storyService,
  topicService,
  storageService,
} = require('../services')

exports.getHomeData = catchAsyncErrors(async (_, res) => {
  let topics = await topicService.getAllTopics({ title: 1 })

  let { trendingStories, recentStories } = await storyService.getHomeStories()

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
    { topics, trendingStories, recentStories },
    messages.SUCCESS.HOME_DATA_FETCHED
  )
})
