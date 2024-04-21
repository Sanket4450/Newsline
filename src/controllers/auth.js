const httpStatus = require('http-status')
const catchAsyncErrors = require('../utils/catchAsyncErrors')
const sendResponse = require('../utils/responseHandler')
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
    messages.SUCCESS.ACCOUNT_REGISTERED
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

exports.verifyResetPasswordOtp = catchAsyncErrors(async (req, res) => {
  const body = req.body

  const decoded = await tokenService.verifyToken(
    body.resetToken,
    process.env.RESET_TOKEN_SECRET
  )

  const account = await accountService.checkAccountExistById(decoded.sub, {
    resetPasswordOtp: 1,
  })

  authService.verifyResetPasswordOtp(body.otp, account.resetPasswordOtp)

  await accountService.removeAccountFieldsById(decoded.sub, {
    resetPasswordOtp: '',
  })

  return sendResponse(
    res,
    httpStatus.OK,
    {},
    messages.SUCCESS.PASSWORD_RESET_OTP_VERIFIED
  )
})

exports.resetPassword = catchAsyncErrors(async (req, res) => {
  const body = req.body

  const decoded = await tokenService.verifyToken(
    body.resetToken,
    process.env.RESET_TOKEN_SECRET
  )

  await accountService.checkAccountExistById(decoded.sub)

  await authService.resetNewPassword(decoded.sub, body.password)

  await sessionService.deleteAllSessions(decoded.sub)

  return sendResponse(
    res,
    httpStatus.OK,
    {},
    messages.SUCCESS.PASSWORD_RESET
  )
})
