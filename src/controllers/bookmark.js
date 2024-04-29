const httpStatus = require('http-status')
const { catchAsyncErrors } = require('../utils/catchAsyncErrors')
const ApiError = require('../utils/ApiError')
const { sendResponse } = require('../utils/responseHandler')
const messages = require('../constants/messages')
const { bookmarkService, storyService } = require('../services')
const { getObjectId } = require('../utils/getObjectId')

exports.getBookmarkCollectionsData = catchAsyncErrors(async (req, res) => {
  const accountId = req.user.accountId
  let bookmarkCollections = await bookmarkService.getAllBookmarkCollections(
    accountId
  )

  !!bookmarkCollections.length &&
    bookmarkCollections.map((collection, idx) => ({
      id: collection._id,
      title: collection.title,
      isSelected: idx === 0,
    }))

  const selectedCollection = bookmarkCollections.find(
    (collection) => collection.isSelected === true
  )

  let stories = selectedCollection
    ? await bookmarkService.getBookmarkStories(selectedCollection.id, {
        page: 1,
        limit: 10,
      })
    : []

  return sendResponse(
    res,
    httpStatus.OK,
    { bookmarkCollections, stories },
    messages.SUCCESS.BOOKMARK_COLLECTIONS_FETCHED
  )
})

exports.getBookmarkCollections = catchAsyncErrors(async (req, res) => {
  const accountId = req.user.accountId
  const { storyId } = req.params

  await storyService.checkStoryExistById(storyId)

  let bookmarkCollections = bookmarkService.getAllBookmarkCollections(
    accountId,
    {
      title: 1,
      stories: 1,
    }
  )

  bookmarkCollections = bookmarkCollections.map((collection) => {
    collection.isSaved = collection?.stories?.some((storyObjectId) =>
      storyObjectId.equals(storyId)
    )

    return collection
  })

  return sendResponse(
    res,
    httpStatus.OK,
    { bookmarkCollections },
    messages.SUCCESS.BOOKMARK_COLLECTIONS_FETCHED
  )
})

exports.getBookmarkStories = catchAsyncErrors(async (_, res) => {
  const { bookmarkCollectionId } = req.params

  let stories = selectedCollection
    ? await bookmarkService.getBookmarkStories(bookmarkCollectionId, {
        page: 1,
        limit: 10,
      })
    : []

  return sendResponse(
    res,
    httpStatus.OK,
    { stories },
    messages.SUCCESS.BOOKMARKED_STORIES_FETCHED
  )
})

exports.createBookmarkCollection = catchAsyncErrors(async (req, res) => {
  const accountId = req.user.accountId
  const body = req.body

  if (await bookmarkService.getBookmarkCollectionByTitle(body.title)) {
    throw new ApiError(
      messages.ERROR.BOOKMARK_EXISTS_WITH_TITLE,
      httpStatus.CONFLICT
    )
  }
  const { _id, title } = await bookmarkService.createBookmarkCollection(
    accountId,
    body
  )

  const bookmarkCollection = {
    id: String(_id),
    title,
  }

  return sendResponse(
    res,
    httpStatus.OK,
    { bookmarkCollection },
    messages.SUCCESS.BOOKMARK_COLLECTION_CREATED
  )
})

exports.deleteBookmarkCollection = catchAsyncErrors(async (req, res) => {
  const accountId = req.user.accountId
  const { bookmarkCollectionId } = req.body

  await bookmarkService.checkBookmarkCollectionExistByAccountAndId(
    accountId,
    bookmarkCollectionId
  )

  await bookmarkService.deleteBookmarkCollection(bookmarkCollectionId)

  return sendResponse(
    res,
    httpStatus.OK,
    {},
    messages.SUCCESS.BOOKMARK_COLLECTION_DELETED
  )
})

exports.toggleSave = catchAsyncErrors(async (req, res) => {
  const accountId = req.user.accountId
  const { storyId, bookmarkCollections } = req.body

  await storyService.checkStoryExistById(storyId)

  for (let collectionId of bookmarkCollections) {
    await bookmarkService.checkBookmarkCollectionExistByAccountAndId(
      accountId,
      collectionId
    )
  }

  await bookmarkService.removeStoryFromAllBookmarks(accountId, storyId)

  for (let collectionId of bookmarkCollections) {
    await bookmarkService.addBookmarkStory(collectionId, storyId)
  }

  return sendResponse(res, httpStatus.OK, {}, messages.SUCCESS.STORY_SAVED)
})
