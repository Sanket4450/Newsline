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
} = require('./common')

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

module.exports = {
  setAccount,
  updateAccount,
  setInterests,
  toggleFollow,
}
