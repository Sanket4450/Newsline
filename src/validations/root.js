const joi = require('joi')

const { stringValidation } = require('./common')

const getSearchResults = {
  query: joi.object({
    search: stringValidation,
  }),
}

module.exports = {
  getSearchResults,
}
