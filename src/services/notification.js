const httpStatus = require('http-status')
const DbRepo = require('../repos/dbRepo')
const collections = require('../constants/collections')
const ApiError = require('../utils/ApiError')
const messages = require('../constants/messages')
const { getObjectId } = require('../utils/getObjectId')

exports.checkNotificationExistById = async (storyId, data = { _id: 1 }) => {
  try {
    const query = {
      _id: getObjectId(storyId),
    }

    const notification = await DbRepo.findOne(collections.NOTIFICATION, {
      query,
      data,
    })

    if (!notification) {
      throw new ApiError(
        messages.ERROR.NOTIFICATION_NOT_FOUND,
        httpStatus.NOT_FOUND
      )
    }

    return notification
  } catch (error) {
    throw new ApiError(
      error.message,
      error.statusCode || httpStatus.INTERNAL_SERVER_ERROR
    )
  }
}

exports.getNotification = (query, data = { _id: 1 }) => {
  return DbRepo.findOne(collections.NOTIFICATION, { query, data })
}

exports.getAllNotifications = (accountId) => {
  const pipeline = [
    {
      $match: {
        accountId: getObjectId(accountId),
      },
    },
    {
      $lookup: {
        from: 'accounts',
        localField: 'iconAccountId',
        foreignField: '_id',
        as: 'iconAccount',
      },
    },
    {
      $unwind: {
        path: '$iconAccount',
        preserveNullAndEmptyArrays: true,
      },
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
      $unwind: {
        path: '$story',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $group: {
        _id: '$_id',
        title: { $first: '$title' },
        type: { $first: '$type' },
        iconKey: { $first: '$iconKey' },
        profileImageKey: { $first: '$iconAccount.profileImageKey' },
        storyImageKey: { $first: '$story.coverImageKey' },
        isFollowedBack: { $first: '$isFollowedBack' },
        isRead: { $first: '$isRead' },
        createdAt: { $first: '$createdAt' },
      },
    },
    {
      $sort: {
        createdAt: -1,
      },
    },
    {
      $project: {
        title: 1,
        type: 1,
        iconKey: 1,
        profileImageKey: 1,
        storyImageKey: 1,
        isFollowedBack: 1,
        isRead: 1,
        _id: 0,
        id: '$_id',
      },
    },
  ]

  return DbRepo.aggregate(collections.NOTIFICATION, pipeline)
}

exports.createNotification = (accountId, dataObject) => {
  const data = {
    accountId: getObjectId(accountId),
    ...dataObject,
  }

  return DbRepo.create(collections.NOTIFICATION, { data })
}

exports.deleteNotification = (accountId, notificationId) => {
  const query = {
    accountId: getObjectId(accountId),
    _id: getObjectId(notificationId),
  }

  return DbRepo.deleteOne(collections.NOTIFICATION, { query })
}

exports.deleteAllNotifications = (accountId) => {
  const query = {
    accountId: getObjectId(accountId),
  }

  return DbRepo.deleteMany(collections.NOTIFICATION, { query })
}

exports.updateNotification = (accountId, notificationId, updateData) => {
  const query = {
    accountId: getObjectId(accountId),
    _id: getObjectId(notificationId),
  }

  const data = {
    $set: {
      ...updateData,
    },
  }

  return DbRepo.updateOne(collections.NOTIFICATION, { query, data })
}

exports.updateNotifications = (accountId, updateData) => {
  const query = {
    accountId: getObjectId(accountId),
  }

  const data = {
    $set: {
      ...updateData,
    },
  }

  return DbRepo.updateMany(collections.NOTIFICATION, { query, data })
}
