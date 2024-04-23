const joi = require('joi')

const {
  stringValidation,
  stringReqValidation,
  arrayReqValidation,
  idReqValidation,
} = require('./common')

const createStory = {
  body: joi.object({
    title: stringReqValidation.max(100),
    description: stringReqValidation,
    topicId: idReqValidation,
    tags: arrayReqValidation.items(stringValidation),
  }),
}

module.exports = {
  createStory,
}
