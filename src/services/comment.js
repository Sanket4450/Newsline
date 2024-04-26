const httpStatus = require('http-status')
const ApiError = require('../utils/ApiError')
const DbRepo = require('../repos/dbRepo')
const messages = require('../constants/messages')
const collections = require('../constants/collections')
const { getObjectId } = require('../utils/getObjectId')

exports.checkCommentExistById = async (storyId, data = { _id: 1 }) => {
  try {
    const query = {
      _id: getObjectId(storyId),
    }

    const comment = await DbRepo.findOne(collections.COMMENT, { query, data })

    if (!comment) {
      throw new ApiError(messages.ERROR.COMMENT_NOT_FOUND, httpStatus.NOT_FOUND)
    }

    return comment
  } catch (error) {
    throw new ApiError(
      error.message,
      error.statusCode || httpStatus.INTERNAL_SERVER_ERROR
    )
  }
}

exports.getComments = (storyId, query) => {
  const page = parseInt(query.page) || 1
  const limit = parseInt(query.limit) || 10

  const pipeline = [
    {
      $match: {
        storyId: getObjectId(storyId),
      },
    },
    {
      $addFields: {
        likes: { $size: '$likedBy' },
      },
    },
    {
      $sort: {
        likes: -1,
        createdAt: -1,
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
        from: 'accounts',
        localField: 'accountId',
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
      $project: {
        content: 1,
        likedBy: 1,
        likes: 1,
        createdAt: 1,
        account: {
          fullName: 1,
          profileImageKey: 1,
        },
        _id: 0,
        id: '$_id',
      },
    },
  ]

  return DbRepo.aggregate(collections.COMMENT, pipeline)
}

exports.getComment = (commentId) => {
  const pipeline = [
    {
      $match: {
        _id: getObjectId(commentId),
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
      $unwind: {
        path: '$account',
      },
    },
    {
      $project: {
        content: 1,
        likedBy: 1,
        likes: { $size: '$likedBy' },
        createdAt: 1,
        account: {
          fullName: 1,
          profileImageKey: 1,
        },
        _id: 0,
        id: '$_id',
      },
    },
  ]

  return DbRepo.aggregate(collections.COMMENT, pipeline)
}

exports.postComment = (accountId, body) => {
  const data = {
    accountId: getObjectId(accountId),
    storyId: getObjectId(body.storyId),
    ...body,
  }

  return DbRepo.create(collections.COMMENT, { data })
}

exports.validateLikedComments = (accountId, comments) => {
  for (let comment of comments) {
    comment.isLiked = comment.likedBy.includes(getObjectId(accountId))
  }

  return comments
}
