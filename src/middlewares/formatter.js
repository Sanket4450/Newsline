const httpStatus = require('http-status')
const ApiError = require('../utils/ApiError')
const messages = require('../constants/messages')

exports.createStory = async (req, _, next) => {
  try {
    req.body.tags = JSON.parse(req.body.tags)
    next()
  } catch (error) {
    next(new ApiError(messages.ERROR.INVALID_JSON, httpStatus.BAD_REQUEST))
  }
}
