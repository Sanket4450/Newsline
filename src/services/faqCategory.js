const httpStatus = require('http-status')
const ApiError = require('../utils/ApiError')
const messages = require('../constants/messages')
const DbRepo = require('../repos/dbRepo')
const collections = require('../constants/collections')
const { getObjectId } = require('../utils/getObjectId')

exports.checkCategoryExistById = async (categoryId, data = { _id: 1 }) => {
  try {
    const query = {
      _id: getObjectId(categoryId),
    }

    const category = await DbRepo.findOne(collections.FAQ_CATEGORY, {
      query,
      data,
    })

    if (!category) {
      throw new ApiError(
        messages.ERROR.CATEGORY_NOT_FOUND,
        httpStatus.NOT_FOUND
      )
    }

    return category
  } catch (error) {
    throw new ApiError(
      error.message,
      error.statusCode || httpStatus.INTERNAL_SERVER_ERROR
    )
  }
}

exports.createCategory = (body) => {
  const data = {
    ...body,
  }
  return DbRepo.create(collections.FAQ_CATEGORY, { data })
}

exports.getCategory = (query = {}, data = { _id: 1 }) => {
  return DbRepo.findOne(collections.FAQ_CATEGORY, { query, data })
}

exports.getCategoryByTitle = (title, data = { _id: 1 }) => {
  const query = {
    title: { $regex: title, $options: 'i' },
  }
  return exports.getCategory(query, data)
}

exports.getAllCategory = (data = { title: 1 }) => {
  return DbRepo.find(collections.FAQ_CATEGORY, { data }, { createdAt: -1 })
}

exports.updateCategoryById = (categoryId, updateData = {}) => {
  const query = {
    _id: getObjectId(categoryId),
  }

  const data = {
    $set: {
      ...updateData,
    },
  }

  return DbRepo.updateOne(collections.FAQ_CATEGORY, { query, data })
}

exports.deleteCategory = (categoryId) => {
  const query = {
    _id: getObjectId(categoryId),
  }

  return DbRepo.deleteOne(collections.FAQ_CATEGORY, { query })
}
