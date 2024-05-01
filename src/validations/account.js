const joi = require('joi')

const {
  stringValidation,
  stringReqValidation,
  mobileValidation,
  dateValidation,
  booleanReqValidation,
  idReqValidation,
  arrayReqValidation,
  idValidation,
  pageAndLimit,
} = require('./common')

const setAccount = {
  body: joi.object({
    fullName: stringReqValidation,
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

const setInterests = {
  body: joi.object({
    selectedInterests: arrayReqValidation.items(idValidation),
  }),
}

const toggleFollow = {
  body: joi.object({
    accountId: idReqValidation,
    isFollowed: booleanReqValidation,
  }),
}

const getSearchAccounts = {
  body: joi.object({
    search: stringValidation,
    ...pageAndLimit,
  }),
}

const getAccountInfo = {
  params: joi.object({
    accountId: idReqValidation,
  }),
}

const getAdminAccounts = {
  body: joi.object({
    search: stringValidation,
    userType: stringValidation.valid('reader', 'author', 'publisher'),
    sortBy: stringValidation.valid(
      'userName_asc',
      'userName_desc',
      'email_asc',
      'email_desc',
      'newest_first',
      'oldest_first'
    ),
    ...pageAndLimit,
  }),
}

const updateUserType = {
  body: joi.object({
    accountId: idReqValidation,
    userType: stringReqValidation.valid('reader', 'author', 'publisher'),
  }),
}

module.exports = {
  setAccount,
  updateAccount,
  setInterests,
  toggleFollow,
  getAdminAccounts,
  getAccountInfo,
  updateUserType,
  getSearchAccounts,
}
