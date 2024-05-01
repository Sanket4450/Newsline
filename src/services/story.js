const httpStatus = require('http-status')
const ApiError = require('../utils/ApiError')
const DbRepo = require('../repos/dbRepo')
const messages = require('../constants/messages')
const collections = require('../constants/collections')
const { getObjectId } = require('../utils/getObjectId')

exports.checkStoryExistById = async (storyId, data = { _id: 1 }) => {
  try {
    const query = {
      _id: getObjectId(storyId),
    }

    const story = await DbRepo.findOne(collections.STORY, { query, data })

    if (!story) {
      throw new ApiError(messages.ERROR.STORY_NOT_FOUND, httpStatus.NOT_FOUND)
    }

    return story
  } catch (error) {
    throw new ApiError(
      error.message,
      error.statusCode || httpStatus.INTERNAL_SERVER_ERROR
    )
  }
}

exports.checkStoryExistByAccountAndId = async (
  accountId,
  storyId,
  data = { _id: 1 }
) => {
  try {
    const query = {
      _id: getObjectId(storyId),
      accountId: getObjectId(accountId),
    }

    const story = await DbRepo.findOne(collections.STORY, { query, data })

    if (!story) {
      throw new ApiError(messages.ERROR.STORY_NOT_FOUND, httpStatus.NOT_FOUND)
    }

    return story
  } catch (error) {
    throw new ApiError(
      error.message,
      error.statusCode || httpStatus.INTERNAL_SERVER_ERROR
    )
  }
}

exports.createStory = (body) => {
  const data = {
    ...body,
  }

  return DbRepo.create(collections.STORY, { data })
}

exports.updateStory = (storyId, updateBody) => {
  const query = {
    _id: getObjectId(storyId),
  }

  const data = {
    $set: {
      ...updateBody,
    },
  }

  return DbRepo.updateOne(collections.STORY, { query, data })
}

exports.deleteStory = (storyId) => {
  const query = {
    _id: getObjectId(storyId),
  }

  return DbRepo.deleteOne(collections.STORY, { query })
}

exports.getHomeStories = async () => {
  try {
    const pipeline = [
      {
        $sort: {
          views: -1,
        },
      },
      {
        $limit: 10,
      },
      {
        $lookup: {
          from: 'topics',
          localField: 'topicId',
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
          title: 1,
          description: 1,
          coverImageKey: 1,
          views: 1,
          createdAt: 1,
          topic: {
            title: 1,
            id: '$topic._id',
          },
          account: {
            fullName: 1,
            profileImageKey: 1,
          },
          _id: 0,
          id: '$_id',
        },
      },
    ]

    const trendingStories = await DbRepo.aggregate(collections.STORY, pipeline)

    pipeline.splice(
      0,
      2,
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $limit: 30,
      }
    )

    const recentStories = await DbRepo.aggregate(collections.STORY, pipeline)

    return { trendingStories, recentStories }
  } catch (error) {
    throw new ApiError(error.message, httpStatus.INTERNAL_SERVER_ERROR)
  }
}

exports.getStories = (body) => {
  const search = body.search || ''
  const page = body.page || 1
  const limit = body.limit || 10
  const accountId = body.accountId ? getObjectId(body.accountId) : null
  const topicId = body.topicId ? getObjectId(body.topicId) : null
  const tagTitle = body.tagTitle || null

  let sortQuery = {}

  switch (body.sortBy) {
    case 'trending':
      sortQuery = { $sort: { views: -1, createdAt: -1 } }
      break

    case 'latest':
      sortQuery = { $sort: { createdAt: -1 } }
      break

    default:
      sortQuery = { $sort: { createdAt: -1 } }
  }

  const pipeline = [
    {
      $match: {
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { tags: { $regex: search, $options: 'i' } },
        ],
        ...(accountId && { accountId }),
        ...(topicId && { topicId }),
        ...(tagTitle && { tags: tagTitle }),
      },
    },
    {
      ...sortQuery,
    },
    {
      $skip: (page - 1) * limit,
    },
    {
      $limit: limit,
    },
    {
      $lookup: {
        from: 'topics',
        localField: 'topicId',
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
        foreignField: 'storyId',
        as: 'comments',
      },
    },
    {
      $project: {
        title: 1,
        description: 1,
        coverImageKey: 1,
        views: 1,
        commentsCount: { $size: '$comments' },
        createdAt: 1,
        topic: {
          title: 1,
          id: '$topic._id',
        },
        account: {
          fullName: 1,
          profileImageKey: 1,
        },
        _id: 0,
        id: '$_id',
      },
    },
  ]

  return DbRepo.aggregate(collections.STORY, pipeline)
}

exports.getFullStory = (storyId) => {
  const pipeline = [
    {
      $match: {
        _id: getObjectId(storyId),
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
      $addFields: {
        commentsCount: 0,
      },
    },
    {
      $project: {
        title: 1,
        description: 1,
        coverImageKey: 1,
        tags: 1,
        views: 1,
        commentsCount: 1,
        createdAt: 1,
        account: {
          fullName: 1,
          bio: 1,
          profileImageKey: 1,
          id: '$account._id',
        },
        _id: 0,
        id: '$_id',
      },
    },
  ]

  return DbRepo.aggregate(collections.STORY, pipeline)
}

exports.getStoriesCount = (accountId) => {
  const query = {
    accountId: getObjectId(accountId),
  }

  return DbRepo.count(collections.STORY, { query })
}
