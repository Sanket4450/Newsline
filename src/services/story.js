const httpStatus = require('http-status')
const ApiError = require('../utils/ApiError')
const messages = require('../constants/messages')
const DbRepo = require('../repos/dbRepo')
const collections = require('../constants/collections')
const { getObjectId } = require('../utils/getObjectId')
const accountService = require('./account')

exports.createStory = (body) => {
  const data = {
    ...body,
  }

  return DbRepo.create(collections.STORY, { data })
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
