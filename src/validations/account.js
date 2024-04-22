const joi = require('joi')

const {
  stringValidation,
  stringReqValidation,
  mobileValidation,
  dateValidation,
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

module.exports = {
  setAccount,
  updateAccount,
}
