const jwt = require('jsonwebtoken')
const httpStatus = require('http-status')
const ApiError = require('../utils/ApiError')
const messages = require('../constants/messages')
const variables = require('../constants/variables')

const generateToken = ({ payload, secret, options }) => {
  return jwt.sign(payload, secret, options)
}

exports.verifyToken = (token, secret) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        if (err.name === 'JsonWebTokenError') {
          reject(
            new ApiError(messages.ERROR.INVALID_TOKEN, httpStatus.UNAUTHORIZED)
          )
        }
        if (err.name === 'TokenExpiredError') {
          reject(
            new ApiError(messages.ERROR.TOKEN_EXPIRED, httpStatus.UNAUTHORIZED)
          )
        }
        reject(new ApiError(err.message, httpStatus.UNAUTHORIZED))
      } else {
        resolve(decoded)
      }
    })
  })
}

exports.generateRegisterToken = (accountId) => {
  Logger.info(`Inside generateRegisterToken => account = ${accountId}`)

  const payload = {
    sub: accountId,
  }

  return generateToken({
    payload,
    secret: process.env.REGISTER_TOKEN_SECRET,
    options: {
      expiresIn: variables.registerTokenExpiry,
    },
  })
}

exports.generateAccessToken = (accountId, role = 'user') => {
  Logger.info(
    `Inside generateAccessToken => account = ${accountId} role = ${role}`
  )

  const payload = {
    sub: accountId,
    role,
  }

  return generateToken({
    payload,
    secret: process.env.ACCESS_TOKEN_SECRET,
  })
}

exports.generateResetToken = (accountId) => {
  Logger.info(`Inside generateResetToken => account = ${accountId}`)

  const payload = {
    sub: accountId,
  }

  return generateToken({
    payload,
    secret: process.env.RESET_TOKEN_SECRET,
    options: {
      expiresIn: variables.resetTokenExpiry,
    },
  })
}
