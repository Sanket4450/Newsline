const httpStatus = require('http-status')
const ApiError = require('../utils/ApiError')
const messages = require('../constants/messages')
const { tokenService, sessionService } = require('../services')

exports.authChecker = async (req, _, next) => {
  try {
    const token =
      req.headers && req.headers.authorization
        ? req.headers.authorization.split(' ')[1]
        : ''
    const decoded = await tokenService.verifyToken(
      token,
      process.env.ACCESS_TOKEN_SECRET
    )

    await sessionService.checkSessionExists(decoded.sub, token)
    await sessionService.updateLastActive(token)

    req.user = decoded
    next()
  } catch (error) {
    Logger.error(error)
    next(error)
  }
}

exports.authorizeRole = (role) => async (req, _, next) => {
  try {
    if (role !== req.user.role) {
      return next(
        new ApiError(messages.ERROR.NOT_ALLOWED, httpStatus.FORBIDDEN)
      )
    }
    next()
  } catch (error) {
    Logger.error(error)
    next(error)
  }
}
