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
} = require('../services')

exports.getStories = catchAsyncErrors(async (req, res) => {
  const body = req.body

  if (body.topicId) {
    await topicService.checkTopicExistById(body.topicId)
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
      commentCount: story.commentCount,
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

  const comments = await commentService.getComments(storyId, {
    limit: 3,
  })

  const stories = await storyService.getStories({
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
  delete story.account.profileImageUrl

  if (
    accountId !== String(story.account.id) &&
    (await accountService.isAccountFollows(accountId, String(story.account.id)))
  ) {
    story.account.isFollowed = true
  } else if (accountId !== String(story.account.id)) {
    story.account.isFollowed = false
  } else {
  }

  return sendResponse(
    res,
    httpStatus.OK,
    { story },
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
    const tag = await tagService.getTagByTitle(tagTitle)

    if (tag) {
      await tagService.incremenPostsCount(String(tag._id))
    } else {
      await tagService.createTag({ title: tagTitle, postsCount: 1 })
    }
  }

  const coverImageKey = await fileService.handleFile(file, folders.STORY)

  body.accountId = accountId
  body.coverImageKey = coverImageKey

  const { accountId: storyAccountId } = await storyService.createStory(body)

  // const { fullName } = await accountService.getAccountById(
  //   String(storyAccountId),
  //   {
  //     fullName,
  //   }
  // )

  // const followers = await accountService.getFollowers(accountId)

  // for (let follower of followers) {
  //   console.log('follower', follower)
  //   await notificationService.createNotification(String(follower._id), {
  //     title: `${fullName} published a new story`,
  //   })
  // }

  return sendResponse(res, httpStatus.OK, {}, messages.SUCCESS.STORY_CREATED)
})
