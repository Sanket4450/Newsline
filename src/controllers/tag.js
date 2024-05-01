const httpStatus = require('http-status')
const { catchAsyncErrors } = require('../utils/catchAsyncErrors')
const { sendResponse } = require('../utils/responseHandler')
const messages = require('../constants/messages')
const { getObjectId } = require('../utils/getObjectId')
const { tagService, accountService, storyService, storageService } = require('../services')

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

exports.getTagInfo = catchAsyncErrors(async (req, res) => {
  const accountId = req.user.accountId
  const { tagId } = req.params

  let tag = await tagService.checkTagExistById(tagId, {
    title: true,
    postsCount: true,
  })

  tag._doc.id = String(tag._id)
  tag._doc.isFollowed = Boolean(
    await accountService.getAccount({
      _id: getObjectId(accountId),
      followingTags: getObjectId(tagId),
    })
  )

  delete tag._doc._id

  let stories = await storyService.getStories({
    tagTitle: tag.title,
    sortBy: 'trending',
    limit: 10,
  })

  stories = await Promise.all(
    stories.map(async (story) => {
      story.coverImageUrl = story.coverImageKey
        ? await storageService.getFileUrl(story.coverImageKey)
        : null

      story.account.profileImageUrl = story.account.profileImageKey
        ? await storageService.getFileUrl(story.account.profileImageKey)
        : null

      delete story.coverImageKey
      delete story.account.profileImageKey

      return story
    })
  )

  const tagInfo = {
    ...tag._doc,
    stories,
  }

  return sendResponse(
    res,
    httpStatus.OK,
    { tagInfo },
    messages.SUCCESS.TAG_INFO_FETCHED
  )
})
