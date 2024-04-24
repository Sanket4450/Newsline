const httpStatus = require('http-status')
const folders = require('../constants/folders')
const { catchAsyncErrors } = require('../utils/catchAsyncErrors')
const { sendResponse } = require('../utils/responseHandler')
const messages = require('../constants/messages')
const { storyService, storageService, commentService } = require('../services')

exports.getComments = catchAsyncErrors(async (req, res) => {
  const accountId = req.user.accountId
  const { storyId } = req.params
  const query = req.query

  await storyService.checkStoryExistById(storyId)

  let comments = await commentService.getComments(storyId, query)

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
    { comments },
    messages.SUCCESS.COMMENTS_FETCHED
  )
})

exports.postComment = catchAsyncErrors(async (req, res) => {
  const accountId = req.user.accountId
  const body = req.body

  await storyService.checkStoryExistById(body.storyId)

  const { _id: commentId } = await commentService.postComment(accountId, body)

  await commentService.checkCommentExistById(String(commentId))

  const comments = await commentService.getComment(String(commentId))

  const [comment] = await commentService.validateLikedComments(
    accountId,
    comments
  )

  comment.account.profileImageUrl = comment.account.profileImageKey
    ? await storageService.getFileUrl(comment.account.profileImageKey)
    : null

  delete comment.account.profileImageKey
  delete comment.likedBy

  return sendResponse(
    res,
    httpStatus.OK,
    { comment },
    messages.SUCCESS.COMMENT_POSTED
  )
})
