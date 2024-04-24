const joi = require('joi')

const {
  stringValidation,
  stringReqValidation,
  arrayReqValidation,
  idReqValidation,
  idValidation,
  pageAndLimit,
} = require('./common')

const getStories = {
  body: joi.object({
    search: stringValidation,
    topicId: idValidation,
    sortBy: stringValidation.valid('trending', 'latest'),
    ...pageAndLimit
  }),
}

const createStory = {
  body: joi.object({
    title: stringReqValidation.max(100),
    description: stringReqValidation,
    topicId: idReqValidation,
    tags: arrayReqValidation.items(stringValidation),
  }),
}

module.exports = {
  getStories,
  createStory,
}
