const httpStatus = require('http-status')
const catchAsyncErrors = require('../utils/catchAsyncErrors')
const sendResponse = require('../utils/responseHandler')
const ApiError = require('../utils/ApiError')
const messages = require('../constants/messages')
const { authService, tokenService } = require('../services')

exports.register = catchAsyncErrors(async (req, res) => {
  const body = req.body

  await authService.checkAccountWithEmail(body.email)

  if (body.isAdmin && body.isAdmin === true) {
    authService.checkSecret(body.secret)
  }

  const { accountId, role } = await authService.createAccount(body)

  const accessToken = tokenService.generateAccessToken(accountId, role)

  return sendResponse(
    res,
    httpStatus.OK,
    { accessToken },
    messages.SUCCESS.ACCOUNT_CREATED
  )
})
