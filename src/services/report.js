const httpStatus = require('http-status')
const ApiError = require('../utils/ApiError')
const DbRepo = require('../repos/dbRepo')
const messages = require('../constants/messages')
const collections = require('../constants/collections')
const { getObjectId } = require('../utils/getObjectId')

exports.checkReportExistById = async (reportId, data = { _id: 1 }) => {
  try {
    const query = {
      _id: getObjectId(reportId),
    }

    const report = await DbRepo.findOne(collections.REPORT, {
      query,
      data,
    })

    if (!report) {
      throw new ApiError(messages.ERROR.REPORT_NOT_FOUND, httpStatus.NOT_FOUND)
    }

    return report
  } catch (error) {
    throw new ApiError(
      error.message,
      error.statusCode || httpStatus.INTERNAL_SERVER_ERROR
    )
  }
}

exports.getReport = (query = {}, data = { _id: 1 }) => {
  return DbRepo.findOne(collections.REPORT, { query, data })
}

exports.createReport = (body) => {
  const data = {
    accountId: getObjectId(body.accountId),
    storyId: getObjectId(body.storyId),
    reportReasonId: getObjectId(body.reportReasonId),
  }

  return DbRepo.create(collections.REPORT, { data })
}

exports.deleteReason = (reportId) => {
  const query = {
    _id: getObjectId(reportId),
  }

  return DbRepo.deleteOne(collections.REPORT, { query })
}
