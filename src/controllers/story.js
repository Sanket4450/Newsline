const httpStatus = require('http-status')
const folders = require('../constants/folders')
const { catchAsyncErrors } = require('../utils/catchAsyncErrors')
const ApiError = require('../utils/ApiError')
const { sendResponse } = require('../utils/responseHandler')
const messages = require('../constants/messages')
const {
  storyService,
  topicService,
  tagService,
  fileService,
  accountService,
} = require('../services')

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
