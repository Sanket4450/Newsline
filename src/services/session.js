const { Types } = require('mongoose')
const httpStatus = require('http-status')
const DbRepo = require('../repos/dbRepo')
const collections = require('../constants/collections')
const messages = require('../constants/messages')
const ApiError = require('../utils/ApiError')

exports.createSession = (accountId, token) => {
  const data = {
    accountId: Types.ObjectId.createFromHexString(accountId),
    token,
  }

  return DbRepo.create(collections.SESSION, { data })
}

exports.checkSessionExists = async (accountId, token) => {
  const query = {
    accountId: Types.ObjectId.createFromHexString(accountId),
    token,
  }

  if (!(await DbRepo.findOne(collections.SESSION, { query }))) {
    throw new ApiError(
      messages.ERROR.SESSION_NOT_FOUND,
      httpStatus.UNAUTHORIZED
    )
  }
}

exports.updateLastActive = async (token) => {
  const query = {
    token,
  }

  const data = {
    lastActive: Date.now(),
  }

  return DbRepo.updateOne(collections.SESSION, { query, data })
}

exports.deleteAllSessions = (accountId) => {
  Logger.info(`Inside deleteAllSessions => accountId = ${accountId}`)

  const query = {
    accountId: Types.ObjectId.createFromHexString(accountId),
  }

  return DbRepo.deleteMany(collections.SESSION, { query })
}
