const httpStatus = require('http-status')
const ApiError = require('../utils/ApiError')
const messages = require('../constants/messages')
const DbRepo = require('../repos/dbRepo')
const collections = require('../constants/collections')
const { getObjectId } = require('../utils/getObjectId')

exports.checkFaqExistById = async (faqId, data = { _id: 1 }) => {
  try {
    const query = {
      _id: getObjectId(faqId),
    }

    const faq = await DbRepo.findOne(collections.FAQ, { query, data })

    if (!faq) {
      throw new ApiError(messages.ERROR.FAQ_NOT_FOUND, httpStatus.NOT_FOUND)
    }

    return faq
  } catch (error) {
    throw new ApiError(
      error.message,
      error.statusCode || httpStatus.INTERNAL_SERVER_ERROR
    )
  }
}

exports.getFaqs = (body) => {
  const search = body.search || ''

  const pipeline = [
    {
      $match: {
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
        ],
        ...(body.faqCategoryId && {
          faqCategoryId: getObjectId(body.faqCategoryId),
        }),
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
        description: 1,
        _id: 0,
        id: '$_id',
      },
    },
  ]

  return DbRepo.aggregate(collections.FAQ, pipeline)
}

exports.createFaq = (body) => {
  const data = {
    faqCategoryId: getObjectId(body.faqCategoryId),
    ...body,
  }
  return DbRepo.create(collections.FAQ, { data })
}

exports.updateFaq = (faqId, updateData = {}) => {
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

exports.deleteFaq = (faqId) => {
  const query = {
    _id: getObjectId(faqId),
  }

  return DbRepo.deleteOne(collections.FAQ, { query })
}

exports.deleteFaqsByCategory = (faqCategoryId) => {
  const query = {
    faqCategoryId: getObjectId(faqCategoryId),
  }

  return DbRepo.deleteMany(collections.FAQ, { query })
}
