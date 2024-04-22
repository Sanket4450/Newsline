const joi = require('joi')

const {
  stringValidation,
  stringReqValidation,
  mobileValidation,
  dateValidation,
  booleanReqValidation,
  idReqValidation,
} = require('./common')
const account = require('../models/account')

const setAccount = {
  body: joi.object({
    fullName: stringValidation,
    userName: stringReqValidation,
    mobile: mobileValidation,
    dateOfBirth: dateValidation,
    gender: stringValidation.valid('male', 'female', 'other'),
    country: stringValidation,
    bio: stringValidation.max(200),
    website: stringValidation,
  }),
}

const updateAccount = {
  body: joi.object({
    fullName: stringValidation,
    userName: stringValidation,
    mobile: mobileValidation,
    dateOfBirth: dateValidation,
    gender: stringValidation.valid('male', 'female', 'other'),
    country: stringValidation,
    bio: stringValidation.max(200),
    website: stringValidation,
  }),
}

const toggleFollow = {
  body: joi.object({
    accountId: idReqValidation,
    isFollowed: booleanReqValidation,
  }),
}

module.exports = {
  setAccount,
  updateAccount,
  toggleFollow,
}
