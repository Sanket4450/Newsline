const httpStatus = require('http-status')
const ApiError = require('../utils/ApiError')
const messages = require('../constants/messages')
const DbRepo = require('../repos/dbRepo')
const collections = require('../constants/collections')
const { getObjectId } = require('../utils/getObjectId')
const accountService = require('./account')
const storageService = require('./storage')

exports.checkTopicExistById = async (topicId, data = { _id: 1 }) => {
  try {
    const query = {
      _id: getObjectId(topicId),
    }

    const topic = await DbRepo.findOne(collections.TOPIC, { query, data })

    if (!topic) {
      throw new ApiError(messages.ERROR.TOPIC_NOT_FOUND, httpStatus.NOT_FOUND)
    }

    return topic
  } catch (error) {
    throw new ApiError(
      error.message,
      error.statusCode || httpStatus.INTERNAL_SERVER_ERROR
    )
  }
}

exports.getTopic = (query = {}, data = { _id: 1 }) => {
  return DbRepo.findOne(collections.TOPIC, { query, data })
}

exports.getAllTopics = (data = { title: 1, iconKey: 1 }) => {
  return DbRepo.find(collections.TOPIC, { data })
}

exports.validateSelectedInterests = async (accountId) => {
  try {
    const topics = await exports.getAllTopics()

    const { interests } = await accountService.getAccountById(accountId, {
      interests: 1,
    })

    for (let topic of topics) {
      if (interests.includes(topic._id)) {
        topic.isSelected = true
      } else {
        topic.isSelected = false
      }
    }

    return topics
  } catch (error) {
    throw new ApiError(
      error.message,
      error.statusCode || httpStatus.INTERNAL_SERVER_ERROR
    )
  }
}

exports.addFileUrls = async (topics) => {
  try {
    const updatedTopics = await Promise.all(
      topics.map(async (topic) => {
        const iconUrl = topic.iconKey
          ? await storageService.getFileUrl(topic.iconKey)
          : null

        return {
          id: topic._id,
          title: topic.title,
          iconUrl,
          isSelected: topic.isSelected,
        }
      })
    )

    return updatedTopics
  } catch (error) {
    throw new ApiError(
      error.message,
      error.statusCode || httpStatus.INTERNAL_SERVER_ERROR
    )
  }
}

exports.createTopic = (body) => {
  const data = {
    ...body,
  }

  return DbRepo.create(collections.TOPIC, { data })
}

exports.updateTopicById = (topicId, updateData = {}) => {
  const query = {
    _id: getObjectId(topicId),
  }

  const data = {
    $set: {
      ...updateData,
    },
  }

  return DbRepo.updateOne(collections.TOPIC, { query, data })
}

exports.deleteTopic = (topicId) => {
  const query = {
    _id: getObjectId(topicId),
  }

  return DbRepo.deleteOne(collections.TOPIC, { query })
}
