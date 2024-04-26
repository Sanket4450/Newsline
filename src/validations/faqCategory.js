const joi = require('joi')

const {
  stringReqValidation,
  idReqValidation,
  stringValidation,
} = require('./common')

const createFaqCategory = {
  body: joi.object({
    title: stringReqValidation,
  }),
}

const updateFaqCategory = {
  body: joi.object({
    faqCategoryId: idReqValidation,
    title: stringValidation,
  }),
}

const deleteFaqCategory = {
  body: joi.object({
    faqCategoryId: idReqValidation,
  }),
}

module.exports = {
  createFaqCategory,
  updateFaqCategory,
  deleteFaqCategory
}
