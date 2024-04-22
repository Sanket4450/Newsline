const joi = require('joi')

const { stringReqValidation } = require('./common')

const createTopic = {
  body: joi.object({
    title: stringReqValidation,
  }),
}

module.exports = {
  createTopic,
}
