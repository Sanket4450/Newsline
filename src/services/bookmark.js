const httpStatus = require('http-status')
const ApiError = require('../utils/ApiError')
const messages = require('../constants/messages')
const DbRepo = require('../repos/dbRepo')
const collections = require('../constants/collections')
const { getObjectId } = require('../utils/getObjectId')

exports.checkBookmarkCollectionExistByAccountAndId = async (
  accountId,
  bookmarkCollectionId,
  data = { _id: 1 }
) => {
  try {
    const query = {
      _id: getObjectId(bookmarkCollectionId),
      accountId: getObjectId(accountId),
    }

    const bookmarkCollection = await DbRepo.findOne(collections.BOOKMARK, {
      query,
      data,
    })

    if (!bookmarkCollection) {
      throw new ApiError(
        messages.ERROR.BOOKMARK_COLLECTION_NOT_FOUND,
        httpStatus.NOT_FOUND
      )
    }

    return bookmarkCollection
  } catch (error) {
    throw new ApiError(
      error.message,
      error.statusCode || httpStatus.INTERNAL_SERVER_ERROR
    )
  }
}

exports.getAllBookmarkCollections = (accountId, data = { title: 1 }) => {
  const query = {
    accountId: getObjectId(accountId),
  }
  return DbRepo.find(collections.BOOKMARK, { query, data })
}

const getBookmarkCollection = (query, data = { title: 1 }) => {
  return DbRepo.findOne(collections.BOOKMARK, { query, data })
}

exports.getBookmarkStories = (collectionId, data) => {
  const page = data?.page || 1
  const limit = data?.limit || 10

  const pipeline = [
    {
      $match: {
        _id: getObjectId(collectionId),
      },
    },
    {
      $unwind: {
        path: '$stories',
      },
    },
    {
      $skip: (page - 1) * limit,
    },
    {
      $limit: limit,
    },
    {
      $lookup: {
        from: 'stories',
        localField: 'stories',
        foreignField: '_id',
        as: 'story',
      },
    },
    {
      $unwind: {
        path: '$story',
      },
    },
    {
      $lookup: {
        from: 'topics',
        localField: 'story.topicId',
        foreignField: '_id',
        as: 'topic',
      },
    },
    {
      $unwind: {
        path: '$topic',
      },
    },
    {
      $lookup: {
        from: 'accounts',
        localField: 'story.accountId',
        foreignField: '_id',
        as: 'account',
      },
    },
    {
      $unwind: {
        path: '$account',
      },
    },
    {
      $lookup: {
        from: 'comments',
        localField: 'story._id',
        foreignField: 'storyId',
        as: 'comments',
      },
    },
    {
      $project: {
        title: '$story.title',
        description: '$story.description',
        coverImageKey: '$story.coverImageKey',
        views: '$story.views',
        commentsCount: { $size: '$comments' },
        createdAt: '$story.createdAt',
        account: {
          fullName: '$account.fullName',
          profileImageKey: '$account.profileImageKey',
        },
        _id: 0,
        id: '$_id',
      },
    },
  ]

  return DbRepo.aggregate(collections.BOOKMARK, pipeline)
}

exports.createBookmarkCollection = (accountId, body) => {
  const data = {
    accountId: getObjectId(accountId),
    ...body,
  }
  return DbRepo.create(collections.BOOKMARK, { data })
}

exports.getBookmarkCollectionByTitle = (title, data = { _id: 1 }) => {
  const query = {
    title: { $regex: title, $options: 'i' },
  }
  return getBookmarkCollection(query, data)
}

exports.deleteBookmarkCollection = (bookmarkCollectionId) => {
  const query = {
    _id: getObjectId(bookmarkCollectionId),
  }

  return DbRepo.deleteOne(collections.BOOKMARK, { query })
}

exports.addBookmarkStory = (collectionId, storyId) => {
  const query = {
    _id: getObjectId(collectionId),
    stories: { $ne: getObjectId(storyId) },
  }

  const data = {
    $push: {
      stories: getObjectId(storyId),
    },
  }
  return DbRepo.updateOne(collections.BOOKMARK, { query, data })
}

exports.removeStoryFromAllBookmarks = (accountId, storyId) => {
  const query = {
    accountId: getObjectId(accountId),
    stories: getObjectId(storyId),
  }

  const data = {
    $pull: {
      stories: getObjectId(storyId),
    },
  }
  return DbRepo.updateMany(collections.BOOKMARK, { query, data })
}
