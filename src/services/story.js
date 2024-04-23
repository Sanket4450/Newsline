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
