const joi = require('joi')

const {
  stringValidation,
  idReqValidation,
  booleanReqValidation,
  pageAndLimit,
} = require('./common')

const getSearchTags = {
  body: joi.object({
    search: stringValidation,
    ...pageAndLimit,
  }),
}

const toggleFollow = {
  body: joi.object({
    tagId: idReqValidation,
    isFollowed: booleanReqValidation,
  }),
}

const getTagInfo = {
  params: joi.object({
    tagId: idReqValidation,
  }),
}

module.exports = {
  getSearchTags,
  toggleFollow,
  getTagInfo,
}
