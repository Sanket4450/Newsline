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
