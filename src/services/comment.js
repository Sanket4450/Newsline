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

exports.checkCommentExistWithAccountById = async (
  accountId,
  storyId,
  data = { _id: 1 }
) => {
  try {
    const query = {
      _id: getObjectId(storyId),
      accountId: getObjectId(accountId),
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

exports.getComments = (body) => {
  const storyId = body.storyId
  const sortBy = body.sortBy || 'top'
  const page = parseInt(body.page) || 1
  const limit = parseInt(body.limit) || 10

  let sortStage = {}

  if (sortBy === 'newest') {
    sortStage = {
      createdAt: -1,
    }
  } else {
    sortStage = {
      likes: -1,
      createdAt: -1,
    }
  }

  const pipeline = [
    {
      $match: {
        type: 'comment',
        storyId: getObjectId(storyId),
      },
    },
    {
      $addFields: {
        likes: { $size: '$likedBy' },
      },
    },
    {
      $sort: sortStage,
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
      $lookup: {
        from: 'comments',
        localField: '_id',
        foreignField: 'commentId',
        as: 'replies',
      },
    },
    {
      $addFields: {
        replies: { $size: '$replies' },
      },
    },
    {
      $project: {
        content: 1,
        likedBy: 1,
        likes: 1,
        replies: 1,
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
    type: 'comment',
    ...body,
  }

  return DbRepo.create(collections.COMMENT, { data })
}

exports.validateLikedComments = (accountId, comments) => {
  for (let comment of comments) {
    comment.isLiked = comment.likedBy?.some((likedById) =>
      likedById.equals(accountId)
    )
  }

  return comments
}

exports.updateComment = (commentId, updateData) => {
  const query = {
    _id: getObjectId(commentId),
  }

  const data = {
    $set: { ...updateData },
  }

  return DbRepo.updateOne(collections.COMMENT, { query, data })
}

exports.deleteComment = (commentId) => {
  const query = {
    _id: getObjectId(commentId),
  }

  return DbRepo.deleteOne(collections.COMMENT, { query })
}

exports.toggleLike = (accountId, commentId, isLiked) => {
  const query = isLiked
    ? {
        _id: getObjectId(commentId),
        likedBy: { $ne: getObjectId(accountId) },
      }
    : {
        _id: getObjectId(commentId),
        likedBy: { $eq: getObjectId(accountId) },
      }

  const data = {
    [isLiked ? '$push' : '$pull']: {
      likedBy: getObjectId(accountId),
    },
  }

  return DbRepo.updateOne(collections.COMMENT, { query, data })
}

exports.getReplies = (commentId) => {
  const pipeline = [
    {
      $match: {
        type: 'reply',
        commentId: getObjectId(commentId),
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

exports.postReply = (accountId, body) => {
  const data = {
    accountId: getObjectId(accountId),
    commentId: getObjectId(body.commentId),
    type: 'reply',
    ...body,
  }

  return DbRepo.create(collections.COMMENT, { data })
}
