const httpStatus = require('http-status')
const bcrypt = require('bcryptjs')
const ApiError = require('../utils/ApiError')
const messages = require('../constants/messages')
const { generateOtp } = require('../utils/generateOtp')
const { getObjectId } = require('../utils/getObjectId')
const accountService = require('./account')
const emailService = require('./email')

exports.checkAccountNotExistWithEmail = async (email) => {
  Logger.info(`Inside checkAccountNotExistWithEmail => email = ${email}`)

  const account = await accountService.getAccount({ email })

  if (account) {
    throw new ApiError(
      messages.ERROR.ACCOUNT_EXISTS_WITH_EMAIL,
      httpStatus.CONFLICT
    )
  }
}

exports.checkAccountNotExistWithUserName = async (userName, accountId) => {
  Logger.info(
    `Inside checkAccountNotExistWithUserName => userName = ${userName}`
  )

  const query = {
    userName,
    ...(accountId && {
      _id: { $ne: getObjectId(accountId) },
    }),
  }

  const account = await accountService.getAccount(query)

  if (account) {
    throw new ApiError(
      messages.ERROR.ACCOUNT_EXISTS_WITH_USERNAME,
      httpStatus.CONFLICT
    )
  }
}

exports.checkAccountNotExistWithMobile = async (mobile, accountId) => {
  Logger.info(`Inside checkAccountNotExistWithMobile => mobile = ${mobile}`)

  const query = {
    mobile,
    ...(accountId && {
      _id: { $ne: getObjectId(accountId) },
    }),
  }

  const account = await accountService.getAccount(query)

  if (account) {
    throw new ApiError(
      messages.ERROR.ACCOUNT_EXISTS_WITH_MOBILE,
      httpStatus.CONFLICT
    )
  }
}

exports.checkAccountExistWithEmail = async (email) => {
  Logger.info(`Inside checkAccountExistWithEmail => email = ${email}`)

  const account = await accountService.getAccount({ email }, { role: 1 })

  if (!account) {
    throw new ApiError(
      messages.ERROR.ACCOUNT_NOT_EXIST_WITH_EMAIL,
      httpStatus.CONFLICT
    )
  }

  return { accountId: String(account._id), role: account.role }
}

exports.sendRegisterOtp = async (email) => {
  Logger.info(`Inside sendRegisterOtp => email = ${email}`)

  const otp = generateOtp()

  const emailOptions = {
    email,
    otp,
  }

  await emailService.sendRegisterOTP(emailOptions)

  return { otp }
}

exports.createAccount = async (body) => {
  Logger.info(`Inside createAccount => body = ${body}`)

  const hashedPassword = await bcrypt.hash(body.password, 10)

  const account = await accountService.createAccount({
    email: body.email,
    password: hashedPassword,
    registerOtp: body.otp,
    role: 'user',
  })

  return { accountId: String(account._id) }
}

exports.verifyRegisterOtp = (otp, registerOtp) => {
  Logger.info(
    `Inside verifyRegisterOtp => otp = ${otp} registerOtp = ${registerOtp}`
  )

  if (otp !== registerOtp) {
    throw new ApiError(
      messages.ERROR.INVALID_REGISTER_OTP,
      httpStatus.UNAUTHORIZED
    )
  }
}

exports.loginAccount = async (body) => {
  Logger.info(`Inside loginAccount => body = ${body}`)

  const data = {
    role: 1,
    password: 1,
  }

  const account = await accountService.getAccount({ email: body.email }, data)

  if (!(await bcrypt.compare(body.password, account.password))) {
    throw new ApiError(
      messages.ERROR.INCORRECT_PASSWORD,
      httpStatus.UNAUTHORIZED
    )
  }
}

exports.forgotPasswordWithEmail = async (email) => {
  Logger.info(`Inside forgotPasswordWithEmail => email = ${email}`)

  const account = await accountService.getAccount({ email }, { fullName: 1 })

  const otp = generateOtp()

  const emailOptions = {
    name: account.fullName ?? '',
    email,
    otp,
  }

  await emailService.sendResetOTP(emailOptions)

  return { accountId: String(account._id), otp }
}

exports.verifyResetPasswordOtp = (otp, resetPasswordOtp) => {
  Logger.info(
    `Inside verifyResetPasswordOtp => otp = ${otp} resetPasswordOtp = ${resetPasswordOtp}`
  )

  if (otp !== resetPasswordOtp) {
    throw new ApiError(
      messages.ERROR.INVALID_RESET_PASSWORD_OTP,
      httpStatus.UNAUTHORIZED
    )
  }
}

exports.resetNewPassword = async (accountId, password) => {
  Logger.info(`Inside resetNewPassword => accountId = ${accountId}`)

  const hashedPassword = await bcrypt.hash(password, 10)

  return accountService.updateAccountById(accountId, {
    password: hashedPassword,
  })
}
