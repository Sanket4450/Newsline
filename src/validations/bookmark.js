const joi = require('joi')

const {
  stringReqValidation,
  idReqValidation,
  arrayReqValidation,
  idValidation,
} = require('./common')

const createBookmarkCollection = {
  body: joi.object({
    title: stringReqValidation,
  }),
}

const deleteBookmarkCollection = {
  body: joi.object({
    bookmarkId: idReqValidation,
  }),
}

const addStoryBookmarkCollection ={
  body: joi.object({
    bookmarkCollections: arrayReqValidation.items(idValidation),
    storyId: idReqValidation
  })
}

module.exports = {
  createBookmarkCollection,
  deleteBookmarkCollection,
  addStoryBookmarkCollection
}
