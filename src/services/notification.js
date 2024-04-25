const DbRepo = require('../repos/dbRepo')
const collections = require('../constants/collections')
const { getObjectId } = require('../utils/getObjectId')

exports.getAllNotification = (accountId) => {
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
        isFollow: { $first: '$isFollow' },
        isRead: { $first: '$isRead' },
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
        isFollow: 1,
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

exports.setNotificationsAsRead = (accountId) => {
  const query = {
    accountId: getObjectId(accountId),
  }

  const data = {
    $set: {
      isRead: true,
    },
  }

  return DbRepo.updateMany(collections.NOTIFICATION, { query, data })
}

exports.updateNotification = (accountId, notificationId) => {
  const query = {
    accountId: getObjectId(accountId),
    _id: getObjectId(notificationId),
  }

  const data = {
    $set: {
      isFollow: true,
    },
  }

  return DbRepo.updateOne(collections.NOTIFICATION, { query, data })
}
