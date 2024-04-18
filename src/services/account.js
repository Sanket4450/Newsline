const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const httpStatus = require('http-status')
const DbRepo = require('../repos/dbRepo')
const collections = require('../constants/collections')
const messages = require('../constants/messages')
const ApiError = require('../utils/ApiError')

exports.getAccount = (query = {}, data = { _id: 1 }) => {
  return DbRepo.findOne(collections.ACCOUNT, { query, data })
}

exports.createAccount = (body) => {
  const data = {
    ...body,
  }

  return DbRepo.create(collections.ACCOUNT, { data })
}
