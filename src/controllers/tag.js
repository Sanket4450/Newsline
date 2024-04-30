const httpStatus = require('http-status')
const { catchAsyncErrors } = require('../utils/catchAsyncErrors')
const { sendResponse } = require('../utils/responseHandler')
const messages = require('../constants/messages')
const { tagService, accountService } = require('../services')

exports.getSearchTags = catchAsyncErrors(async (req, res) => {
  const accountId = req.user.accountId
  const body = req.body

  let tags = await tagService.getTags(body)

  tags = await Promise.all(
    tags.map(async (tag) => ({
      id: String(tag._id),
      title: tag.title,
      postsCount: tag.postsCount,
    }))
  )

  tags = await accountService.validateFollowedTags(accountId, tags)

  return sendResponse(
    res,
    httpStatus.OK,
    { tags },
    messages.SUCCESS.TAGS_FETCHED
  )
})

exports.toggleFollow = catchAsyncErrors(async (req, res) => {
  const accountId = req.user.accountId
  const { tagId, isFollowed } = req.body

  await tagService.checkTagExistById(tagId)

  await tagService.toggleFollow(accountId, tagId, isFollowed)

  return sendResponse(
    res,
    httpStatus.OK,
    { isFollowed },
    `Tag ${isFollowed ? 'Followed' : 'Unfollowed'} successfully`
  )
})
