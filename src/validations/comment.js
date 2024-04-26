const joi = require('joi')

const {
  stringReqValidation,
  idReqValidation,
  pageAndLimit,
} = require('./common')

const getComments = {
  params: joi.object({
    storyId: idReqValidation,
  }),
  query: joi.object({
    ...pageAndLimit,
  }),
}

const postComment = {
  body: joi.object({
    storyId: idReqValidation,
    content: stringReqValidation,
  }),
}

module.exports = {
  getComments,
  postComment,
}
