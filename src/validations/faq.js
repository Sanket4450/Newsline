const joi = require('joi')

const {
  stringReqValidation,
  idReqValidation,
  stringValidation,
  idValidation,
} = require('./common')

const getFaqs = {
  body: joi.object({
    faqCategoryId: idValidation,
  }),
}

const createFaq = {
  body: joi.object({
    faqCategoryId: idReqValidation,
    title: stringReqValidation.max(100),
    description: stringReqValidation,
  }),
}

const updateFaq = {
  body: joi.object({
    faqId: idReqValidation,
    title: stringValidation.max(100),
    description: stringValidation,
  }),
}

const deleteFaq = {
  body: joi.object({
    faqId: idReqValidation,
  }),
}

module.exports = {
  getFaqs,
  createFaq,
  updateFaq,
  deleteFaq,
}
