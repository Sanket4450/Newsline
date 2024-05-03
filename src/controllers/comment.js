const httpStatus = require('http-status')
const { catchAsyncErrors } = require('../utils/catchAsyncErrors')
const { sendResponse } = require('../utils/responseHandler')
const messages = require('../constants/messages')
const {
  storyService,
  storageService,
  commentService,
  accountService,
  notificationService,
} = require('../services')
const { getObjectId } = require('../utils/getObjectId')

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
  const { storyId, ...body } = req.body

  const { fullName } = await accountService.checkAccountExistById(accountId, {
    fullName: 1,
  })

  const { accountId: storyAccountId } = await storyService.checkStoryExistById(
    storyId,
    { accountId: 1 }
  )

  const { _id: commentId } = await commentService.postComment(
    accountId,
    storyId,
    body
  )

  const [comment] = await commentService.getComment(String(commentId))

  comment.account.profileImageUrl = comment.account.profileImageKey
    ? await storageService.getFileUrl(comment.account.profileImageKey)
    : null
  comment.isLiked = false

  delete comment.account.profileImageKey
  delete comment.likedBy

  if (accountId !== String(storyAccountId)) {
    await notificationService.createNotification(String(storyAccountId), {
      type: 'publish',
      event: 'postComment',
      title: `${fullName} ${messages.NOTIFICATION.COMMENTED_ON_STORY}`,
      iconAccountId: getObjectId(accountId),
      storyId: getObjectId(storyId),
      commentId,
    })
  }

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

  const notifications = await notificationService.getNotifications(
    {
      event: { $in: ['postComment', 'likeComment', 'postReply'] },
      commentId: getObjectId(commentId),
    },
    {
      accountId: 1,
    }
  )

  for (let notification of notifications) {
    await notificationService.deleteNotification(
      String(notification.accountId),
      String(notification._id)
    )
  }

  return sendResponse(res, httpStatus.OK, {}, messages.SUCCESS.COMMENT_DELETED)
})

exports.toggleLike = catchAsyncErrors(async (req, res) => {
  const accountId = req.user.accountId
  const { commentId, isLiked } = req.body

  const { fullName } = await accountService.checkAccountExistById(accountId, {
    fullName: 1,
  })

  const { accountId: commentAccountId } =
    await commentService.checkCommentExistById(commentId, { accountId: 1 })

  await commentService.toggleLike(accountId, commentId, isLiked)

  if (accountId !== String(commentAccountId)) {
    const notification = await notificationService.getNotification(
      {
        event: 'likeComment',
        accountId: commentAccountId,
        iconAccountId: getObjectId(accountId),
        commentId: getObjectId(commentId),
      },
      { accountId: 1 }
    )
    if (isLiked) {
      !notification &&
        (await notificationService.createNotification(
          String(commentAccountId),
          {
            event: 'likeComment',
            title: `${fullName} ${messages.NOTIFICATION.LIKED_YOUR_COMMENT}`,
            iconAccountId: getObjectId(accountId),
            commentId: getObjectId(commentId),
          }
        ))
    } else {
      notification &&
        (await notificationService.deleteNotification(
          String(notification.accountId),
          String(notification._id)
        ))
    }
  }

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
  const { commentId, ...body } = req.body

  const { fullName } = await accountService.checkAccountExistById(accountId, {
    fullName: 1,
  })

  const { accountId: commentAccountId } =
    await commentService.checkCommentExistById(commentId, { accountId: 1 })

  const { _id: replyId } = await commentService.postReply(
    accountId,
    commentId,
    body
  )

  const [reply] = await commentService.getComment(String(replyId))

  reply.account.profileImageUrl = reply.account.profileImageKey
    ? await storageService.getFileUrl(reply.account.profileImageKey)
    : null
  reply.isLiked = false

  delete reply.account.profileImageKey
  delete reply.likedBy

  if (accountId !== String(commentAccountId)) {
    await notificationService.createNotification(String(commentAccountId), {
      event: 'postComment',
      title: `${fullName} ${messages.NOTIFICATION.REPLIED_ON_COMMENT}`,
      iconAccountId: getObjectId(accountId),
      commentId: replyId,
    })
  }

  return sendResponse(
    res,
    httpStatus.OK,
    { reply },
    messages.SUCCESS.COMMENT_REPLY_POSTED
  )
})
