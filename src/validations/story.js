const joi = require('joi')

const {
  stringValidation,
  stringReqValidation,
  arrayReqValidation,
  idReqValidation,
  idValidation,
  pageAndLimit,
  tagValidation,
  arrayValidation,
} = require('./common')

const getStories = {
  body: joi.object({
    search: stringValidation,
    accountId: idValidation,
    topicId: idValidation,
    tagId: idValidation,
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

const updateStory = {
  body: joi.object({
    storyId: idReqValidation,
    title: stringValidation.max(100),
    description: stringValidation,
    topicId: idValidation,
    tags: arrayValidation.items(tagValidation),
  }),
}

const deleteStory = {
  body: joi.object({
    storyId: idReqValidation,
  }),
}

module.exports = {
  getStories,
  getStory,
  createStory,
  updateStory,
  deleteStory,
}
