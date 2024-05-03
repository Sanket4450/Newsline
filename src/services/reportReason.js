const httpStatus = require('http-status')
const ApiError = require('../utils/ApiError')
const messages = require('../constants/messages')
const DbRepo = require('../repos/dbRepo')
const collections = require('../constants/collections')
const { getObjectId } = require('../utils/getObjectId')

exports.checkReasonExistById = async (reasonId, data = { _id: 1 }) => {
  try {
    const query = {
      _id: getObjectId(reasonId),
    }

    const reason = await DbRepo.findOne(collections.REPORT_REASON, {
      query,
      data,
    })

    if (!reason) {
      throw new ApiError(
        messages.ERROR.REPORT_REASON_NOT_FOUND,
        httpStatus.NOT_FOUND
      )
    }

    return reason
  } catch (error) {
    throw new ApiError(
      error.message,
      error.statusCode || httpStatus.INTERNAL_SERVER_ERROR
    )
  }
}

exports.createReason = (body) => {
  const data = {
    ...body,
  }
  return DbRepo.create(collections.REPORT_REASON, { data })
}

exports.getReason = (query = {}, data = { _id: 1 }) => {
  return DbRepo.findOne(collections.REPORT_REASON, { query, data })
}

exports.getReasonByTitle = (title, reasonId, data = { _id: 1 }) => {
  const query = {
    title: { $regex: new RegExp(`^${title}$`, 'i') },
    ...(reasonId && { _id: { $ne: getObjectId(reasonId) } }),
  }
  return exports.getReason(query, data)
}

exports.getAllReasons = (data = { title: 1 }) => {
  return DbRepo.find(collections.REPORT_REASON, { data })
}

exports.updateReasonById = (reasonId, updateData = {}) => {
  const query = {
    _id: getObjectId(reasonId),
  }

  const data = {
    $set: {
      ...updateData,
    },
  }

  return DbRepo.updateOne(collections.REPORT_REASON, { query, data })
}

exports.deleteReason = (reasonId) => {
  const query = {
    _id: getObjectId(reasonId),
  }

  return DbRepo.deleteOne(collections.REPORT_REASON, { query })
}
