const httpStatus = require('http-status')
const folders = require('../constants/folders')
const { catchAsyncErrors } = require('../utils/catchAsyncErrors')
const ApiError = require('../utils/ApiError')
const { sendResponse } = require('../utils/responseHandler')
const messages = require('../constants/messages')
const { topicService, fileService, storageService } = require('../services')

exports.getTopics = catchAsyncErrors(async (_, res) => {
  let topics = await topicService.getAllTopics({ title: 1 })

  topics = topics.map((topic) => ({
    id: topic._id,
    title: topic.title,
  }))

  return sendResponse(
    res,
    httpStatus.OK,
    { topics },
    messages.SUCCESS.TOPICS_FETCHED
  )
})

exports.getAdminTopics = catchAsyncErrors(async (_, res) => {
  let topics = await topicService.getAllTopics()

  topics = await Promise.all(
    topics.map(async (topic) => ({
      id: topic._id,
      title: topic.title,
      iconUrl: topic.iconKey
        ? await storageService.getFileUrl(topic.iconKey)
        : null,
    }))
  )

  return sendResponse(
    res,
    httpStatus.OK,
    { topics },
    messages.SUCCESS.TOPICS_FETCHED
  )
})

exports.createTopic = catchAsyncErrors(async (req, res) => {
  const file = req.file
  const body = req.body

  if (await topicService.getTopic({ title: body.title })) {
    throw new ApiError(
      messages.ERROR.TOPIC_EXISTS_WITH_TITLE,
      httpStatus.BAD_REQUEST
    )
  }

  const iconKey = await fileService.handleFile(file, folders.TOPIC)

  body.iconKey = iconKey

  await topicService.createTopic(body)

  return sendResponse(res, httpStatus.OK, {}, messages.SUCCESS.TOPIC_CREATED)
})

exports.deleteTopic = catchAsyncErrors(async (req, res) => {
  const { topicId } = req.body

  await topicService.checkTopicExistById(topicId)

  await topicService.checkTopicHasStories(topicId)

  await topicService.deleteTopic(topicId)

  return sendResponse(res, httpStatus.OK, {}, messages.SUCCESS.TOPIC_DELETED)
})
