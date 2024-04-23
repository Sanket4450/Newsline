const joi = require('joi')

const {
  stringValidation,
  stringReqValidation,
  mobileValidation,
  dateValidation,
} = require('./common')

const createStory = {
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

module.exports = {
  createStory,
}
