const joi = require('joi')

const {
  stringReqValidation,
  idReqValidation,
  arrayReqValidation,
  idValidation,
} = require('./common')

const getBookmarkCollections = {
  params: joi.object({
    storyId: idReqValidation
  })
}

const getBookmarkStories = {
  params: joi.object({
    bookmarkCollectionId: idReqValidation,
  }),
}

const createBookmarkCollection = {
  body: joi.object({
    title: stringReqValidation,
  }),
}

const deleteBookmarkCollection = {
  body: joi.object({
    bookmarkCollectionId: idReqValidation,
  }),
}

const toggleSave = {
  body: joi.object({
    storyId: idReqValidation,
    bookmarkCollections: arrayReqValidation.items(idValidation),
  }),
}

const removeBookmarkStory = {
  body: joi.object({
    storyId: idReqValidation,
    bookmarkCollectionId: idReqValidation,
  }),
}

module.exports = {
  getBookmarkCollections,
  getBookmarkStories,
  createBookmarkCollection,
  deleteBookmarkCollection,
  toggleSave,
  removeBookmarkStory,
}
