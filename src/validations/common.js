const joi = require('joi')

const stringValidation = joi.string().trim()
const stringReqValidation = stringValidation.required()
const emailValidation = stringReqValidation.email().lowercase()
const passwordValidation = stringReqValidation.min(8)
const numberValidation = joi.number()
const numberReqValidation = numberValidation.required()
const integerNumberValidation = numberValidation.integer()
const integerNumberReqValidation = integerNumberValidation.required()
const booleanValidation = joi.boolean().strict()
const booleanReqValidation = booleanValidation.required()
const dateValidation = joi.date()
const dateReqValidation = joi.date().required()
const arrayValidation = joi.array()
const arrayReqValidation = arrayValidation.required()

const pageAndLimit = {
  page: integerNumberValidation.min(1),
  limit: integerNumberValidation.min(1),
}

const idValidation = stringValidation
  .pattern(new RegExp('^[0-9a-fA-F]{24}$'))
  .messages({
    'string.pattern.base': 'Invalid ID. Please provide a valid ObjectId',
  })

const idReqValidation = idValidation.required()

const otpValidation = integerNumberReqValidation.min(1000).max(9999).messages({
  'integer.pattern.base': 'OTP should be 4 digit number',
})

const mobileValidation = numberValidation
  .min(10 ** 9)
  .max(10 ** 10 - 1)
  .messages({
    'number.min': 'Mobile number should be 10 digit',
    'number.max': 'Mobile number should be 10 digit',
  })

const tagValidation = stringValidation
  .pattern(new RegExp('^[a-zA-Z0-9_]+$'))
  .messages({
    'string.pattern.base':
      'Invalid tag. Please provide a valid tag without special characters',
  })

module.exports = {
  stringValidation,
  stringReqValidation,
  emailValidation,
  passwordValidation,
  numberValidation,
  numberReqValidation,
  integerNumberValidation,
  integerNumberReqValidation,
  booleanValidation,
  booleanReqValidation,
  dateValidation,
  dateReqValidation,
  arrayValidation,
  arrayReqValidation,
  pageAndLimit,
  idValidation,
  idReqValidation,
  otpValidation,
  mobileValidation,
  tagValidation
}
