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

const getTagsearch = {
  body: joi.object({
    search: stringReqValidation,
    page: joi.number().integer().optional().allow(null),
    limit: joi.number().integer().optional().allow(null),
  })
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
    search: stringValidation,
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
  createTitleCategory,
  deleteCategory,
  updateCategory,
  searchCategory,
  getTagsearch
}
