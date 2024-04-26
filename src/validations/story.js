const joi = require('joi')

const {
  stringValidation,
  stringReqValidation,
  arrayReqValidation,
  idReqValidation,
  idValidation,
  pageAndLimit,
  tagValidation,
} = require('./common')

const getStories = {
  body: joi.object({
    search: stringValidation,
    topicId: idValidation,
    sortBy: stringValidation.valid('trending', 'latest'),
    ...pageAndLimit,
  }),
}

const getStory = {
  params: joi.object({
    storyId: idReqValidation,
  }),
}

const createStory = {
  body: joi.object({
    title: stringReqValidation.max(100),
    description: stringReqValidation,
    topicId: idReqValidation,
    tags: arrayReqValidation.items(tagValidation),
  }),
}

module.exports = {
  getStories,
  getStory,
  createStory,
}
