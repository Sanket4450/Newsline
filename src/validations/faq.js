const joi = require('joi')

const {
  stringReqValidation,
  idReqValidation,
  idValidation,
  stringValidation,
} = require('./common')

const createTitleCategory = {
  body: joi.object({
    faqCategoryId: idReqValidation,
    title: stringReqValidation,
    description: stringReqValidation
  }),
}

const deleteCategory = {
  body: joi.object({
    faqId: idReqValidation,
  }),
}

const updateCategory = {
  body: joi.object({
    faqId: idReqValidation,
    title: stringReqValidation,
    description: stringReqValidation
  }),
}

const searchCategory = {
  body: joi.object({
    faqCategoryId: idValidation,
    search: stringValidation
  })
}
module.exports = {
  createTitleCategory,
  deleteCategory,
  updateCategory,
  searchCategory
}
