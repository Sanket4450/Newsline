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

const login = {
  body: joi.object({
    email: emailValidation,
    password: passwordValidation,
  }),
}

module.exports = {
  register,
  login,
}
