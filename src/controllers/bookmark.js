const httpStatus = require('http-status')
const { catchAsyncErrors } = require('../utils/catchAsyncErrors')
const ApiError = require('../utils/ApiError')
const { sendResponse } = require('../utils/responseHandler')
const messages = require('../constants/messages')
const { bookmarkService, storyService, storageService } = require('../services')

exports.getBookmarkCollectionsData = catchAsyncErrors(async (req, res) => {
  const accountId = req.user.accountId
  let bookmarkCollections = await bookmarkService.getAllBookmarkCollections(
    accountId
  )

  bookmarkCollections = !!bookmarkCollections.length
    ? bookmarkCollections.map((collection, idx) => ({
        id: collection._id,
        title: collection.title,
        isSelected: idx === 0,
      }))
    : []

  const selectedCollection = bookmarkCollections.find(
    (collection) => collection.isSelected === true
  )

  let stories = selectedCollection
    ? await bookmarkService.getBookmarkStories(String(selectedCollection.id), {
        page: 1,
        limit: 10,
      })
    : []

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

  let bookmarkCollections = await bookmarkService.getAllBookmarkCollections(
    accountId,
    {
      title: 1,
      stories: 1,
    }
  )

  bookmarkCollections = bookmarkCollections.map((collection) => ({
    id: String(collection._id),
    title: collection.title,
    isSaved: collection?.stories?.some((storyObjectId) =>
      storyObjectId.equals(storyId)
    ),
  }))

  return sendResponse(
    res,
    httpStatus.OK,
    { bookmarkCollections },
    messages.SUCCESS.BOOKMARK_COLLECTIONS_FETCHED
  )
})

exports.getBookmarkStories = catchAsyncErrors(async (req, res) => {
  const accountId = req.user.accountId
  const { bookmarkCollectionId } = req.params

  await bookmarkService.checkBookmarkCollectionExistByAccountAndId(
    accountId,
    bookmarkCollectionId
  )

  let stories = await bookmarkService.getBookmarkStories(bookmarkCollectionId, {
    page: 1,
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
