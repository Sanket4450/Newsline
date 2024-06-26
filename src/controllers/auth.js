const httpStatus = require('http-status')
const { catchAsyncErrors } = require('../utils/catchAsyncErrors')
const { sendResponse } = require('../utils/responseHandler')
const messages = require('../constants/messages')
const notifications = require('../constants/notifications')
const {
  authService,
  tokenService,
  sessionService,
  accountService,
  notificationService,
} = require('../services')
const ApiError = require('../utils/ApiError')

exports.register = catchAsyncErrors(async (req, res) => {
  const body = req.body

  await authService.checkAccountNotExistWithEmail(body.email)

  body.otp = await authService.sendRegisterOtp(body.email)

  const { accountId } = await authService.createAccount(body)

  const registerToken = tokenService.generateRegisterToken(accountId)

  return sendResponse(
    res,
    httpStatus.OK,
    { registerToken },
    messages.SUCCESS.REGISTER_OTP_SENT
  )
})

exports.resendRegisterOtp = catchAsyncErrors(async (req, res) => {
  const body = req.body

  const { accountId } = await authService.checkAccountExistWithEmail(body.email)

  const { isEmailVerified } = await accountService.getAccountById(accountId, {
    isEmailVerified: 1,
  })

  if (isEmailVerified) {
    throw new ApiError(
      messages.ERROR.EMAIL_ALREADY_VERIFIED,
      httpStatus.CONFLICT
    )
  }

  const registerOtp = await authService.sendRegisterOtp(body.email)

  await accountService.updateAccountById(accountId, { registerOtp })

  const registerToken = tokenService.generateRegisterToken(accountId)

  return sendResponse(
    res,
    httpStatus.OK,
    { registerToken },
    messages.SUCCESS.REGISTER_OTP_SENT
  )
})

exports.verifyRegisterOtp = catchAsyncErrors(async (req, res) => {
  const body = req.body

  const decoded = await tokenService.verifyToken(
    body.registerToken,
    process.env.REGISTER_TOKEN_SECRET
  )

  const account = await accountService.checkAccountExistById(decoded.sub, {
    registerOtp: 1,
    role: 1,
  })

  const accountId = String(account._id)
  const role = account.role

  authService.verifyRegisterOtp(body.otp, account.registerOtp)

  await accountService.removeAccountFieldsById(accountId, {
    registerOtp: '',
  })

  await accountService.updateAccountById(accountId, { isEmailVerified: true })

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

  const { accountId, role } = await authService.checkAccountExistWithEmail(
    body.email
  )

  if (body.isAdmin && role !== 'admin') {
    throw new ApiError(
      messages.ERROR.ONLY_ADMINS_CAN_LOGIN,
      httpStatus.UNAUTHORIZED
    )
  }

  await authService.loginAccount(body)

  const { isEmailVerified, isProfileCompleted } =
    await accountService.getAccountById(accountId, {
      isEmailVerified: 1,
      isProfileCompleted: 1,
    })

  if (!isEmailVerified) {
    const registerOtp = await authService.sendRegisterOtp(body.email)

    await accountService.updateAccountById(accountId, { registerOtp })
  }

  const registerToken = !isEmailVerified
    ? tokenService.generateRegisterToken(accountId)
    : null

  const accessToken = isEmailVerified
    ? tokenService.generateAccessToken(accountId, role)
    : null

  isEmailVerified &&
    (await sessionService.createSession(accountId, accessToken))

  return sendResponse(
    res,
    httpStatus.OK,
    {
      ...(!!registerToken && { registerToken }),
      ...(!!accessToken && { accessToken }),
      isEmailVerified,
      isProfileCompleted,
    },
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

  await notificationService.createNotification(decoded.sub, {
    event: 'setupAccount',
    iconKey: notifications.USER,
    title: messages.NOTIFICATION.PASSWORD_UPDATED,
  })

  return sendResponse(res, httpStatus.OK, {}, messages.SUCCESS.PASSWORD_RESET)
})

exports.resetOldPassword = catchAsyncErrors(async (req, res) => {
  const accountId = req.user.accountId
  const body = req.body

  const { password } = await accountService.checkAccountExistById(accountId, {
    password: 1,
  })

  await authService.matchPassword(body.oldPassword, password)

  await authService.resetNewPassword(accountId, body.password)

  await notificationService.createNotification(accountId, {
    event: 'setupAccount',
    iconKey: notifications.USER,
    title: messages.NOTIFICATION.PASSWORD_UPDATED,
  })

  return sendResponse(res, httpStatus.OK, {}, messages.SUCCESS.PASSWORD_RESET)
})
