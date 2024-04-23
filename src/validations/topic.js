const joi = require('joi')

const {
  stringReqValidation,
  idReqValidation,
} = require('./common')

const createTopic = {
  body: joi.object({
    title: stringReqValidation,
  }),
}

const deleteTopic = {
  body: joi.object({
    topicId: idReqValidation,
  }),
}

module.exports = {
  createTopic,
  deleteTopic,
}
