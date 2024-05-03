const joi = require('joi')

const { stringValidation, pageAndLimit } = require('./common')

const getSearchResults = {
  body: joi.object({
    search: stringValidation,
    type: stringValidation.valid('stories', 'accounts', 'tags'),
    ...pageAndLimit,
  }),
}

module.exports = {
  getSearchResults,
}
