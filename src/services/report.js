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

exports.getReportsByStory = (storyId, data = { _id: 1 }) => {
  const query = {
    storyId: getObjectId(storyId),
  }

  return DbRepo.find(collections.REPORT, { query, data })
}

exports.getReports = (filter) => {
  const page = filter.page || 1
  const limit = filter.limit || 10
  const sortBy = filter.sortBy || 'newest_first'
  const reportReasonId = filter.reportReasonId
    ? getObjectId(filter.reportReasonId)
    : null

  let sortQuery

  if (sortBy === 'oldest_first') {
    sortQuery = { createdAt: 1 }
  } else {
    sortQuery = { createdAt: -1 }
  }

  const pipeline = [
    {
      $match: {
        ...(reportReasonId && { reportReasonId }),
      },
    },
    {
      $lookup: {
        from: 'accounts',
        localField: 'accountId',
        foreignField: '_id',
        as: 'account',
      },
    },
    {
      $unwind: '$account',
    },
    {
      $lookup: {
        from: 'stories',
        localField: 'storyId',
        foreignField: '_id',
        as: 'story',
      },
    },
    {
      $unwind: '$story',
    },
    {
      $lookup: {
        from: 'reportreasons',
        localField: 'reportReasonId',
        foreignField: '_id',
        as: 'reportReason',
      },
    },
    {
      $unwind: '$reportReason',
    },
    {
      $sort: sortQuery,
    },
    {
      $skip: (page - 1) * limit,
    },
    {
      $limit: limit,
    },
    {
      $project: {
        account: {
          id: '$account._id',
          fullName: '$account.fullName',
          profileImageKey: '$account.profileImageKey',
        },
        story: {
          id: '$story._id',
          title: '$story.title',
          coverImageKey: '$story.coverImageKey',
        },
        reportReason: {
          id: '$reportReason._id',
          title: '$reportReason.title',
        },
        createdAt: 1,
        _id: 0,
        id: '$_id',
      },
    },
  ]

  return DbRepo.aggregate(collections.REPORT, pipeline)
}

exports.createReport = (accountId, body) => {
  const data = {
    accountId: getObjectId(accountId),
    storyId: getObjectId(body.storyId),
    reportReasonId: getObjectId(body.reportReasonId),
  }

  return DbRepo.create(collections.REPORT, { data })
}

exports.deleteReport = (reportId) => {
  const query = {
    _id: getObjectId(reportId),
  }

  return DbRepo.deleteOne(collections.REPORT, { query })
}
