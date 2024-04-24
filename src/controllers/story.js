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
} = require('../services')

exports.getStories = catchAsyncErrors(async (req, res) => {
  const body = req.body
  
  if (body.topicId) {
    await topicService.checkTopicExistById(body.topicId)
  }

  let stories = await storyService.getStories(body)

  // stories = await Promise.all(
  //   stories.map(async (story) => ({
  //     id: String(story.id),
  //     title: story.title,
  //     description: story.description,
  //     coverImageUrl: story.coverImageKey
  //       ? await storageService.getFileUrl(story.coverImageKey)
  //       : null,
  //     views: story.views,
  //     createdAt: story.createdAt,
  //     topic: {
  //       id: String(story.topic.id),
  //       title: story.topic.title,
  //     },
  //     account: {
  //       fullName: story.account.fullName,
  //       profileImageUrl: story.account.profileImageKey
  //         ? await storageService.getFileUrl(story.account.profileImageKey)
  //         : null,
  //     },
  //   }))
  // )

  return sendResponse(res, httpStatus.OK, { stories }, messages.SUCCESS.STORIES_FETCHED)
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

  await storyService.createStory(body)

  return sendResponse(res, httpStatus.OK, {}, messages.SUCCESS.STORY_CREATED)
})
