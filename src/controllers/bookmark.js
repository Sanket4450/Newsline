const httpStatus = require('http-status')
const folders = require('../constants/folders')
const { catchAsyncErrors } = require('../utils/catchAsyncErrors')
const ApiError = require('../utils/ApiError')
const { sendResponse } = require('../utils/responseHandler')
const messages = require('../constants/messages')
const { bookmarkService, storyService } = require('../services')

exports.createBookmarkCollection = catchAsyncErrors(async (req, res) => {
  const body = req.body

  if (await bookmarkService.getBookmarkCollectionByTitle(body.title)) {
    throw new ApiError(
      messages.ERROR.BOOKMARK_EXISTS_WITH_BOOKMARKTITLE,
      httpStatus.BAD_REQUEST
    )
  }  
  await bookmarkService.createBookmark(body)

  return sendResponse(res, httpStatus.OK, {}, messages.SUCCESS.BOOKMARK_COLLECTION_CREATED)
})

exports.findBookmarkCollection = catchAsyncErrors(async(req,res)=>{
  const data = await bookmarkService.getAllBookmark()
  return sendResponse(
    res,
    httpStatus.OK,
    { data },
    messages.SUCCESS.BOOKMARK_COLLECTION_FETCHED
  )
})

exports.getStoryBookmarkCollection = catchAsyncErrors(async(req,res)=>{
  const data = await bookmarkService.getStoryBookmark()
  return sendResponse(
    res,
    httpStatus.OK,
    { data },
    messages.SUCCESS.BOOKMARK_COLLECTION_FETCHED
  )
})



exports.deleteBookmarkCollection = catchAsyncErrors(async (req, res) => {
  const { bookmarkId } = req.body

  await bookmarkService.checkBookmarkCollectionExistById(bookmarkId)

  await bookmarkService.deleteBookmark(bookmarkId)
  
  return sendResponse(res, httpStatus.OK, {}, messages.SUCCESS.BOOKMARK_COLLECTION_DELETED)
})

exports.addStoryBookmarkCollection = catchAsyncErrors(async(req,res)=>{
  const { bookmarkCollections, storyId } = req.body

  await storyService.checkStoryExistById(storyId)

  for (let collectionId of bookmarkCollections) {
    await bookmarkService.checkBookmarkCollectionExistById(collectionId)

    await bookmarkService.addStoryBookmark(collectionId, storyId)
  }

  return sendResponse(res, httpStatus.OK, {}, messages.SUCCESS.STORY_ADD_BOOKMARK_COLLECTION)
})

