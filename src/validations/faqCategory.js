const joi = require('joi')

const {
  stringReqValidation,
  idReqValidation,
} = require('./common')

const createCategory = {
  body: joi.object({
    title: stringReqValidation,
  }),
}

const deleteCategory = {
  body: joi.object({
    categoryId: idReqValidation,
  }),
}

const updateCategory = {
  body: joi.object({
    categoryId: idReqValidation,
    title: stringReqValidation
  }),
}

module.exports = {
  createCategory,
  deleteCategory,
  updateCategory
}
