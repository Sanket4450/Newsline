const httpStatus = require('http-status')
const { catchAsyncErrors } = require('../utils/catchAsyncErrors')
const { sendResponse } = require('../utils/responseHandler')
const messages = require('../constants/messages')
const { storyService, storageService, commentService } = require('../services')

exports.getComments = catchAsyncErrors(async (req, res) => {
  const accountId = req.user.accountId
  const body = req.body

  await storyService.checkStoryExistById(body.storyId)

  let comments = await commentService.getComments(body)

  const commentsCount = await commentService.getTotalCommentsCount(body.storyId)

  comments = await commentService.validateLikedComments(accountId, comments)

  comments = await Promise.all(
    comments.map(async (comment) => {
      comment.account.profileImageUrl = comment.account.profileImageKey
        ? await storageService.getFileUrl(comment.account.profileImageKey)
        : null

      delete comment.account.profileImageKey
      delete comment.likedBy

      return comment
    })
  )

  return sendResponse(
    res,
    httpStatus.OK,
    { comments, commentsCount },
    messages.SUCCESS.COMMENTS_FETCHED
  )
})

exports.postComment = catchAsyncErrors(async (req, res) => {
  const accountId = req.user.accountId
  const body = req.body

  await storyService.checkStoryExistById(body.storyId)

  const { _id: commentId } = await commentService.postComment(accountId, body)

  const [comment] = await commentService.getComment(String(commentId))

  comment.account.profileImageUrl = comment.account.profileImageKey
    ? await storageService.getFileUrl(comment.account.profileImageKey)
    : null
  comment.isLiked = false

  delete comment.account.profileImageKey
  delete comment.likedBy

  return sendResponse(
    res,
    httpStatus.OK,
    { comment },
    messages.SUCCESS.COMMENT_POSTED
  )
})

exports.updateComment = catchAsyncErrors(async (req, res) => {
  const accountId = req.user.accountId
  const { commentId, ...updateBody } = req.body

  await commentService.checkCommentExistWithAccountById(accountId, commentId)

  await commentService.updateComment(commentId, updateBody)

  const [comment] = await commentService.getComment(commentId)

  comment.account.profileImageUrl = comment.account.profileImageKey
    ? await storageService.getFileUrl(comment.account.profileImageKey)
    : null
  comment.isLiked = false

  delete comment.account.profileImageKey
  delete comment.likedBy

  return sendResponse(
    res,
    httpStatus.OK,
    { comment },
    messages.SUCCESS.COMMENT_UPDATED
  )
})

exports.deleteComment = catchAsyncErrors(async (req, res) => {
  const accountId = req.user.accountId
  const { commentId } = req.body

  await commentService.checkCommentExistWithAccountById(accountId, commentId)

  await commentService.deleteComment(commentId)

  return sendResponse(res, httpStatus.OK, {}, messages.SUCCESS.COMMENT_DELETED)
})

exports.toggleLike = catchAsyncErrors(async (req, res) => {
  const accountId = req.user.accountId
  const { commentId, isLiked } = req.body

  await commentService.checkCommentExistById(commentId)

  await commentService.toggleLike(accountId, commentId, isLiked)

  return sendResponse(
    res,
    httpStatus.OK,
    { isLiked },
    `Comment ${isLiked ? 'Liked' : 'Disliked'} successfully`
  )
})

exports.getReplies = catchAsyncErrors(async (req, res) => {
  const accountId = req.user.accountId
  const { commentId } = req.params

  await commentService.checkCommentExistById(commentId)

  let replies = await commentService.getReplies(commentId)

  replies = await commentService.validateLikedComments(accountId, replies)

  replies = await Promise.all(
    replies.map(async (reply) => {
      reply.account.profileImageUrl = reply.account.profileImageKey
        ? await storageService.getFileUrl(reply.account.profileImageKey)
        : null

      delete reply.account.profileImageKey
      delete reply.likedBy

      return reply
    })
  )

  return sendResponse(
    res,
    httpStatus.OK,
    { replies },
    messages.SUCCESS.COMMENT_REPLIES_FETCHED
  )
})

exports.postReply = catchAsyncErrors(async (req, res) => {
  const accountId = req.user.accountId
  const body = req.body

  await commentService.checkCommentExistById(body.commentId)

  const { _id: replyId } = await commentService.postReply(accountId, body)

  const [reply] = await commentService.getComment(String(replyId))

  reply.account.profileImageUrl = reply.account.profileImageKey
    ? await storageService.getFileUrl(reply.account.profileImageKey)
    : null
  reply.isLiked = false

  delete reply.account.profileImageKey
  delete reply.likedBy

  return sendResponse(
    res,
    httpStatus.OK,
    { reply },
    messages.SUCCESS.COMMENT_REPLY_POSTED
  )
})
