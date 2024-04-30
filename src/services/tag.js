const httpStatus = require('http-status')
const ApiError = require('../utils/ApiError')
const messages = require('../constants/messages')
const DbRepo = require('../repos/dbRepo')
const collections = require('../constants/collections')
const { getObjectId } = require('../utils/getObjectId')

exports.checkTagExistById = async (tagId, data = { _id: 1 }) => {
  try {
    const query = {
      _id: getObjectId(tagId),
    }

    const tag = await DbRepo.findOne(collections.TAG, { query, data })

    if (!tag) {
      throw new ApiError(messages.ERROR.TAG_NOT_FOUND, httpStatus.NOT_FOUND)
    }

    return tag
  } catch (error) {
    throw new ApiError(
      error.message,
      error.statusCode || httpStatus.INTERNAL_SERVER_ERROR
    )
  }
}

exports.getTagByTitle = (title, data = { _id: 1 }) => {
  const query = {
    title,
  }

  return DbRepo.findOne(collections.TAG, { query, data })
}

exports.createTag = (body) => {
  const data = {
    ...body,
  }

  return DbRepo.create(collections.TAG, { data })
}

exports.incremenPostsCount = (tagId) => {
  const query = {
    _id: getObjectId(tagId),
  }

  const data = {
    $inc: {
      postsCount: 1,
    },
  }

  return DbRepo.updateOne(collections.TAG, { query, data })
}

exports.getSuggestedTags = () => {
  const pipeline = [
    { $sample: { size: 10 } },
    { $sort: { postsCount: -1, createdAt: -1 } },
  ]

  return DbRepo.aggregate(collections.TAG, pipeline)
}

exports.getTags = (body) => {
  const search = body.search || ''
  const page = body.page || 1
  const limit = body.limit || 10

  const query = {
    title: { $regex: search, $options: 'i' },
  }

  const data = {
    title: 1,
    postsCount: 1,
  }

  const sortQuery = {
    postsCount: -1,
    createdAt: -1,
  }

  return DbRepo.findPage(
    collections.TAG,
    { query, data },
    sortQuery,
    page,
    limit
  )
}

exports.toggleFollow = (accountId, tagId, isFollowed) => {
  const query = isFollowed
    ? {
        _id: getObjectId(accountId),
        followingTags: { $ne: getObjectId(tagId) },
      }
    : {
        _id: getObjectId(accountId),
        followingTags: { $eq: getObjectId(tagId) },
      }

  const data = {
    [isFollowed ? '$push' : '$pull']: {
      followingTags: getObjectId(tagId),
    },
  }

  return DbRepo.updateOne(collections.ACCOUNT, { query, data })
}
