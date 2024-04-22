const { Types } = require('mongoose')
const httpStatus = require('http-status')
const ApiError = require('../utils/ApiError')
const messages = require('../constants/messages')
const DbRepo = require('../repos/dbRepo')
const collections = require('../constants/collections')
const accountService = require('./account')
const storageService = require('./storage')

exports.checkTopicExistById = async (topicId, data = { _id: 1 }) => {
  try {
    const query = {
      _id: Types.ObjectId.createFromHexString(topicId),
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

exports.getAllTopics = () => {
  const data = {
    title: 1,
    iconKey: 1,
  }

  return DbRepo.find(collections.TOPIC, { data })
}

exports.validateSelectedTopics = async (accountId) => {
  try {
    const topics = await exports.getAllTopics()

    const { interests } = await accountService.getAccountById(accountId, {
      interests: 1,
    })

    topics.forEach((topic) => {
      if (interests.includes(topic._id)) {
        topic.isSelected = true
      } else {
        topic.isSelected = false
      }
    })

    return topics
  } catch (error) {
    throw new ApiError(
      error.message,
      error.statusCode || httpStatus.INTERNAL_SERVER_ERROR
    )
  }
}

exports.addFileUrls = async (records) => {
  try {
    const updatedRecords = await Promise.all(
      records.map(async (record) => {
        const iconUrl = record.iconKey
          ? await storageService.getFileUrl(record.iconKey)
          : null

        return {
          id: record._id,
          title: record.title,
          iconUrl,
        }
      })
    )

    return updatedRecords
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
    _id: Types.ObjectId.createFromHexString(topicId),
  }

  const data = {
    $set: {
      ...updateData,
    },
  }

  return DbRepo.updateOne(collections.TOPIC, { query, data })
}
