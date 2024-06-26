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
  reportService,
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
    const { title } = await tagService.checkTagExistById(body.tagId)
    body.tagTitle = title
  }

  body.shouldTopicIncluded = true

  let stories = await storyService.getStories(body)

  stories = await Promise.all(
    stories.map(async (story) => {
      story.coverImageUrl = story.coverImageKey
        ? await storageService.getFileUrl(story.coverImageKey)
        : null

      story.topic.id = String(story.topic.id)

      story.account.profileImageUrl = story.account.profileImageKey
        ? await storageService.getFileUrl(story.account.profileImageKey)
        : null

      delete story.coverImageKey
      delete story.account.profileImageKey

      return story
    })
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
    notStoryId: storyId,
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
    moreStories.map(async (story) => {
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

  await storyService.incrementViewsCount(storyId)

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
      event: 'uploadStory',
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

exports.getAdminStory = catchAsyncErrors(async (req, res) => {
  const { storyId } = req.params

  await storyService.checkStoryExistById(storyId)

  let [story] = await storyService.getFullStory(storyId)

  story.coverImageUrl = story.coverImageKey
    ? await storageService.getFileUrl(story.coverImageKey)
    : null
  story.account.profileImageUrl = story.account.profileImageKey
    ? await storageService.getFileUrl(story.account.profileImageKey)
    : null

  delete story.coverImageKey
  delete story.account.profileImageKey

  return sendResponse(
    res,
    httpStatus.OK,
    { story },
    messages.SUCCESS.STORY_DATA_FETCHED
  )
})

exports.deleteStory = catchAsyncErrors(async (req, res) => {
  const accountId = req.user.accountId
  const role = req.user.role
  const { storyId } = req.body

  role === 'admin'
    ? await storyService.checkStoryExistById(storyId)
    : await storyService.checkStoryExistByAccountAndId(accountId, storyId)

  await storyService.deleteStory(storyId)

  const comments = await commentService.getCommentsByStory(storyId)

  const bookmarkCollections =
    await bookmarkService.getBookmarkCollectionsByStory(storyId)

  const notifications = await notificationService.getNotifications(
    {
      storyId: getObjectId(storyId),
    },
    {
      accountId: 1,
    }
  )

  const reports = await reportService.getReportsByStory(storyId)

  for (comm of comments) {
    await commentService.deleteComment(String(comm._id))
    await commentService.deleteReplies(comm._id)
  }

  for (let collection of bookmarkCollections) {
    await bookmarkService.deleteNotification(String(collection._id), storyId)
  }

  for (let notification of notifications) {
    await notificationService.deleteNotification(
      String(notification.accountId),
      String(notification._id)
    )
  }

  for (let report of reports) {
    await reportService.deleteReport(String(report._id))
  }

  return sendResponse(res, httpStatus.OK, {}, messages.SUCCESS.STORY_DELETED)
})
