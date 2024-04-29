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


exports.gatTagFullSearch= (find) =>{
  const search = find.search || ''
  const page = find.page || 1
  const limit = find.limit || 10

  const pipeline = []

  pipeline.push({ 
    $match: {
      type: { $ne: "reader" }
    },
  })

  pipeline.push(
  {
    $match: {
         title: { $regex: search, $options: 'i' } 
    },
  },
  // {  
  //   $skip: (page - 1) * limit,
  // },
  // {
  //   $limit: limit,
  // },
  {
    $project: {
      title: 1,
      _id: 0,
      id: '$_id',
    }
  }
)
   
  return DbRepo.aggregate(collections.TAG , pipeline)
}