const joi = require('joi')

const {
  stringReqValidation,
  idReqValidation,
  pageAndLimit,
  stringValidation,
  booleanReqValidation,
} = require('./common')

const getComments = {
  body: joi.object({
    storyId: idReqValidation,
    sortBy: stringValidation.valid('top', 'newest'),
    ...pageAndLimit,
  }),
}

const postComment = {
  body: joi.object({
    storyId: idReqValidation,
    content: stringReqValidation,
  }),
}

const updateComment = {
  body: joi.object({
    commentId: idReqValidation,
    content: stringValidation,
  }),
}

const deleteComment = {
  body: joi.object({
    commentId: idReqValidation,
  }),
}

const toggleLike = {
  body: joi.object({
    commentId: idReqValidation,
    isLiked: booleanReqValidation,
  }),
}

const getReplies = {
  params: joi.object({
    commentId: idReqValidation,
  }),
}

const postReply = {
  body: joi.object({
    commentId: idReqValidation,
    content: stringReqValidation,
  }),
}

module.exports = {
  getComments,
  postComment,
  updateComment,
  deleteComment,
  toggleLike,
  getReplies,
  postReply,
}
