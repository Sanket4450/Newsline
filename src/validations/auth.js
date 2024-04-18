const joi = require('joi')

const {
  emailValidation,
  passwordValidation,
  booleanValidation,
  stringValidation,
} = require('./common')

const register = {
  body: joi.object({
    email: emailValidation,
    password: passwordValidation,
    isAdmin: booleanValidation,
    secret: stringValidation,
  }),
}

module.exports = {
  register,
}
