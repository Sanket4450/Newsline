const joi = require('joi')

const {
  stringValidation,
  pageAndLimit,
  stringReqValidation,
} = require('./common')

const getSearchResults = {
  body: joi.object({
    search: stringValidation,
    type: stringReqValidation.valid('stories', 'accounts', 'tags'),
    ...pageAndLimit,
  }),
}

module.exports = {
  getSearchResults,
}
