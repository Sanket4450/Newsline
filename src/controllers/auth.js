const httpStatus = require('http-status')
const catchAsyncErrors = require('../utils/catchAsyncErrors')
const sendResponse = require('../utils/responseHandler')
const ApiError = require('../utils/ApiError')
const messages = require('../constants/messages')
const {
  authService,
  tokenService,
  sessionService,
  accountService,
} = require('../services')

exports.register = catchAsyncErrors(async (req, res) => {
  const body = req.body

  await authService.checkAccountNotExistWithEmail(body.email)

  if (body.isAdmin && body.isAdmin === true) {
    authService.checkSecret(body.secret)
  }

  const { accountId, role } = await authService.createAccount(body)

  const accessToken = tokenService.generateAccessToken(accountId, role)

  await sessionService.createSession(accountId, accessToken)

  return sendResponse(
    res,
    httpStatus.OK,
    { accessToken },
    messages.SUCCESS.ACCOUNT_CREATED
  )
})

exports.login = catchAsyncErrors(async (req, res) => {
  const body = req.body

  await authService.checkAccountExistWithEmail(body.email)

  const { accountId, role } = await authService.loginAccount(body)

  const accessToken = tokenService.generateAccessToken(accountId, role)

  await sessionService.createSession(accountId, accessToken)

  return sendResponse(
    res,
    httpStatus.OK,
    { accessToken },
    messages.SUCCESS.ACCOUNT_LOGGED_IN
  )
})

exports.forgotPassword = catchAsyncErrors(async (req, res) => {
  const body = req.body

  await authService.checkAccountExistWithEmail(body.email)

  const { accountId, otp } = await authService.forgotPasswordWithEmail(
    body.email
  )

  await accountService.updateAccountById(accountId, { resetPasswordOtp: otp })

  const resetToken = tokenService.generateResetToken(accountId)

  return sendResponse(
    res,
    httpStatus.OK,
    { resetToken },
    messages.SUCCESS.PASSWORD_RESET_OTP_SENT
  )
})
