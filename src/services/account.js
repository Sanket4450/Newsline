const { Types } = require('mongoose')
const httpStatus = require('http-status')
const ApiError = require('../utils/ApiError')
const messages = require('../constants/messages')
const DbRepo = require('../repos/dbRepo')
const collections = require('../constants/collections')

exports.getAccountById = (accountId, data = { _id: 1 }) => {
  const query = {
    _id: Types.ObjectId.createFromHexString(accountId),
  }

  return DbRepo.findOne(collections.ACCOUNT, { query, data })
}

exports.getAccount = (query = {}, data = { _id: 1 }) => {
  return DbRepo.findOne(collections.ACCOUNT, { query, data })
}

exports.checkAccountExistById = async (accountId, data = { _id: 1 }) => {
  try {
    const query = {
      _id: Types.ObjectId.createFromHexString(accountId),
    }

    const account = await DbRepo.findOne(collections.ACCOUNT, { query, data })

    if (!account) {
      throw new ApiError(
        messages.ERROR.ACCOUNT_NOT_FOUND,
        httpStatus.UNAUTHORIZED
      )
    }

    return account
  } catch (error) {
    throw new ApiError(
      error.message,
      httpStatus.statusCode || httpStatus.INTERNAL_SERVER_ERROR
    )
  }
}

exports.createAccount = (body) => {
  const data = {
    ...body,
  }

  return DbRepo.create(collections.ACCOUNT, { data })
}

exports.updateAccountById = (accountId, updateData = {}) => {
  const query = {
    _id: Types.ObjectId.createFromHexString(accountId),
  }

  const data = {
    $set: {
      ...updateData,
    },
  }

  return DbRepo.updateOne(collections.ACCOUNT, { query, data })
}

exports.updateAccount = (query = {}, updateData = {}) => {
  const data = {
    $set: {
      ...updateData,
    },
  }

  return DbRepo.updateOne(collections.ACCOUNT, { query, data })
}

exports.removeAccountFieldsById = (accountId, fields = {}) => {
  const query = {
    _id: Types.ObjectId.createFromHexString(accountId),
  }

  const data = {
    $unset: {
      ...fields,
    },
  }

  return DbRepo.updateOne(collections.ACCOUNT, { query, data })
}
