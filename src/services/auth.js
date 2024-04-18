const httpStatus = require('http-status')
const bcrypt = require('bcryptjs')
const ApiError = require('../utils/ApiError')
const messages = require('../constants/messages')
const accountService = require('./account')

exports.checkAccountWithEmail = async (email) => {
  Logger.info(`Inside checkAccountWithEmail => email = ${email}`)

  const account = await accountService.getAccount({ email })

  if (account) {
    throw new ApiError(
      messages.ERROR.ACCOUNT_EXISTS_WITH_EMAIL,
      httpStatus.CONFLICT
    )
  }
}

exports.checkSecret = (secret) => {
  if (secret !== process.env.ADMIN_SECRET) {
    throw new ApiError(messages.ERROR.INVALID_SECRET, httpStatus.UNAUTHORIZED)
  }
}

exports.createAccount = async (body) => {
  Logger.info(`Inside createAccount => body = ${body}`)

  const hashedPassword = await bcrypt.hash(body.password, 10)

  const account = await accountService.createAccount({
    email: body.email,
    password: hashedPassword,
    role: body.isAdmin && body.isAdmin === true ? 'admin' : 'user',
  })

  return { accountId: account._id, role: account.role }
}
