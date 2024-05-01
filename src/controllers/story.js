const httpStatus = require('http-status')
const folders = require('../constants/folders')
const { catchAsyncErrors } = require('../utils/catchAsyncErrors')
const { sendResponse } = require('../utils/responseHandler')
const messages = require('../constants/messages')
const {
  storyService,
  topicService,
  tagService,
  fileService,
  accountService,
  storageService,
  notificationService,
  commentService,
  bookmarkService,
} = require('../services')
const { getObjectId } = require('../utils/getObjectId')

exports.getStories = catchAsyncErrors(async (req, res) => {
  const body = req.body

  if (body.accountId) {
    await accountService.checkAccountExistById(body.accountId)
  }

  if (body.topicId) {
    await topicService.checkTopicExistById(body.topicId)
  }

  if (body.tagId) {
    const { title } = await accountService.checkAccountExistById(body.accountId)
    body.tagTitle = title
  }

  let stories = await storyService.getStories(body)

  stories = await Promise.all(
    stories.map(async (story) => ({
      id: String(story.id),
      title: story.title,
      description: story.description,
      coverImageUrl: story.coverImageKey
        ? await storageService.getFileUrl(story.coverImageKey)
        : null,
      views: story.views,
      commentsCount: story.commentsCount,
      createdAt: story.createdAt,
      topic: {
        id: String(story.topic.id),
        title: story.topic.title,
      },
      account: {
        fullName: story.account.fullName,
        profileImageUrl: story.account.profileImageKey
          ? await storageService.getFileUrl(story.account.profileImageKey)
          : null,
      },
    }))
  )

  return sendResponse(
    res,
    httpStatus.OK,
    { stories },
    messages.SUCCESS.STORIES_FETCHED
  )
})

exports.getStory = catchAsyncErrors(async (req, res) => {
  const accountId = req.user.accountId
  const { storyId } = req.params

  await storyService.checkStoryExistById(storyId)

  let [story] = await storyService.getFullStory(storyId)

  const isSaved = Boolean(
    await bookmarkService.isStorySaved(accountId, storyId)
  )

  let comments = await commentService.getComments({ storyId, limit: 3 })

  let moreStories = await storyService.getStories({
    accountId: String(story.account.id),
    limit: 10,
  })

  story.coverImageUrl = story.coverImageKey
    ? await storageService.getFileUrl(story.coverImageKey)
    : null
  story.account.profileImageUrl = story.account.profileImageKey
    ? await storageService.getFileUrl(story.account.profileImageKey)
    : null

  delete story.coverImageKey
  delete story.account.profileImageKey

  if (
    accountId !== String(story.account.id) &&
    (await accountService.isAccountFollows(accountId, String(story.account.id)))
  ) {
    story.account.isFollowed = true
  } else if (accountId !== String(story.account.id)) {
    story.account.isFollowed = false
  } else {
  }

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

  moreStories = await Promise.all(
    moreStories.map(async (story) => ({
      id: String(story.id),
      title: story.title,
      description: story.description,
      coverImageUrl: story.coverImageKey
        ? await storageService.getFileUrl(story.coverImageKey)
        : null,
      views: story.views,
      commentsCount: story.commentsCount,
      createdAt: story.createdAt,
      topic: {
        id: String(story.topic.id),
        title: story.topic.title,
      },
      account: {
        fullName: story.account.fullName,
        profileImageUrl: story.account.profileImageKey
          ? await storageService.getFileUrl(story.account.profileImageKey)
          : null,
      },
    }))
  )

  const fullStory = {
    ...story,
    comments,
    moreStories,
    isSaved,
  }

  return sendResponse(
    res,
    httpStatus.OK,
    { fullStory },
    messages.SUCCESS.STORY_DATA_FETCHED
  )
})

exports.createStory = catchAsyncErrors(async (req, res) => {
  const accountId = req.user.accountId

  const file = req.file
  const body = req.body

  await accountService.validateAccountType(accountId)

  await topicService.checkTopicExistById(body.topicId)

  for (let tagTitle of body.tags) {
    tagTitle = tagTitle.toLowerCase()

    const tag = await tagService.getTagByTitle(tagTitle)

    if (tag) {
      await tagService.incremenPostsCount(String(tag._id))
    } else {
      await tagService.createTag({ title: tagTitle, postsCount: 1 })
    }
  }

  const coverImageKey = await fileService.handleFile(file, folders.STORY)

  body.accountId = getObjectId(accountId)
  body.coverImageKey = coverImageKey

  const { _id: storyId } = await storyService.createStory(body)

  const { fullName } = await accountService.getAccountById(accountId, {
    fullName: 1,
  })

  const followers = await accountService.getFollowers(accountId)

  for (let follower of followers) {
    await notificationService.createNotification(String(follower._id), {
      type: 'publish',
      title: `${fullName} ${messages.NOTIFICATION.PUBLISHED_NEW_STORY}`,
      iconAccountId: getObjectId(accountId),
      storyId,
    })
  }

  return sendResponse(res, httpStatus.OK, {}, messages.SUCCESS.STORY_CREATED)
})

exports.getSuggestedTags = catchAsyncErrors(async (_, res) => {
  let tags = await tagService.getSuggestedTags()

  tags = tags.map((tag) => tag.title)

  return sendResponse(
    res,
    httpStatus.OK,
    { tags },
    messages.SUCCESS.SUGGESTED_TAGS_FETCHED
  )
})

exports.updateStory = catchAsyncErrors(async (req, res) => {
  const accountId = req.user.accountId

  const file = req.file
  const { storyId, ...body } = req.body

  await storyService.checkStoryExistByAccountAndId(accountId, storyId)

  if (body.topicId) {
    await topicService.checkTopicExistById(body.topicId)
  }

  if (body.tags) {
    for (let tagTitle of body.tags) {
      tagTitle = tagTitle.toLowerCase()

      const tag = await tagService.getTagByTitle(tagTitle)

      if (tag) {
        await tagService.incremenPostsCount(String(tag._id))
      } else {
        await tagService.createTag({ title: tagTitle, postsCount: 1 })
      }
    }
  }

  if (file) {
    const coverImageKey = await fileService.handleFile(file, folders.STORY)
    body.coverImageKey = coverImageKey
  }

  await storyService.updateStory(storyId, body)

  return sendResponse(res, httpStatus.OK, {}, messages.SUCCESS.STORY_UPDATED)
})

exports.deleteStory = catchAsyncErrors(async (req, res) => {
  const accountId = req.user.accountId
  const { storyId } = req.body

  await storyService.checkStoryExistByAccountAndId(accountId, storyId)

  await storyService.deleteStory(storyId)

  return sendResponse(res, httpStatus.OK, {}, messages.SUCCESS.STORY_DELETED)
})
