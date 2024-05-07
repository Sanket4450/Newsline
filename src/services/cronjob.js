const cron = require('node-cron')
const httpStatus = require('http-status')
const ApiError = require('../utils/ApiError')
const messages = require('../constants/messages')
const accountService = require('./account')

cron.schedule('0 0 * * *', async () => {
  try {
    await accountService.deleteExpiredSessions()
  } catch (error) {
    throw new ApiError(
      messages.ERROR.COULD_NOT_DELETE_SESSIONS,
      httpStatus.INTERNAL_SERVER_ERROR
    )
  }
})

module.exports = cron
