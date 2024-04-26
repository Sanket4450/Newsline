const httpStatus = require('http-status')
const ApiError = require('../utils/ApiError')
const messages = require('../constants/messages')
const DbRepo = require('../repos/dbRepo')
const collections = require('../constants/collections')
const { getObjectId } = require('../utils/getObjectId')
const storageService = require('./storage')

exports.getFaqs = (body) => {
  const search = body.search || ''

  const pipeline = [
    {
      $match: {
        $or: [
          {title: {$regex: search, $options: 'i'}},
          {description: {$regex: search, $options: 'i'}}
        ],
        ...(body.faqCategoryId && {faqCategoryId: getObjectId(body.faqCategoryId)})
      }
    },
    {
      $sort: {
        createdAt: -1
      }
    },
    {
      $project: {
        title: 1,
        description: 1,
        _id: 0,
        id: '$_id'
      }
    }
  ]

  return DbRepo.aggregate(collections.FAQ, pipeline)
}

exports.createTitleDescription = (body) => {
  const data = {
    faqCategoryId: getObjectId(body.faqCategoryId),
    ...body,
  }
  return DbRepo.create(collections.FAQ, { data })
}

exports.getTitle = (query = {}, data = { _id: 1 }) => {
  return DbRepo.findOne(collections.FAQ, { query, data })
}

exports.getCategoryByTitle = (title, data = {_id: 1})=> {
  const query = {
    title: {$regex: title, $options: 'i'}
  }

  return exports.getTitle(query, data)
}

exports.updateTitleDescriptionById = (faqId, updateData = {}) => {
  const query = {
    _id: getObjectId(faqId),
  }

  const data = {
    $set: {
      ...updateData,
    },
  }

  return DbRepo.updateOne(collections.FAQ, { query, data })
}

exports.deleteTitleDescription = (faqId = {}) => {
  const query = {
    _id: getObjectId(faqId),
  }

  return DbRepo.deleteOne(collections.FAQ, { query })
}

exports.checkCategoryExistById = async (faqId, data = { _id: 1 }) => {
  try {
    const query = {
      _id: getObjectId(faqId),
    }

    const category = await DbRepo.findOne(collections.FAQ, { query, data })

    if (!category) {
      throw new ApiError(messages.ERROR.CATEGORY_NOT_FOUND, httpStatus.NOT_FOUND)
    }

    return category
  } catch (error) {
    throw new ApiError(
      error.message,
      error.statusCode || httpStatus.INTERNAL_SERVER_ERROR
    )
  }
}

exports.deleteFaqsByCategory = (faqCategoryId) => {
  const query = {
    faqCategoryId: getObjectId(faqCategoryId),
  }

  return DbRepo.deleteMany(collections.FAQ, { query })
}