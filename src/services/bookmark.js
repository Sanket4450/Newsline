const httpStatus = require('http-status')
const ApiError = require('../utils/ApiError')
const messages = require('../constants/messages')
const DbRepo = require('../repos/dbRepo')
const collections = require('../constants/collections')
const { getObjectId } = require('../utils/getObjectId')
const { BookmarkCollection } = require('../models')

exports.checkBookmarkCollectionExistById = async (bookmarkId, data = { _id: 1 }) => {
  try {
    const query = {
      _id: getObjectId(bookmarkId),
    }

    const category = await DbRepo.findOne(collections.BOOKMARK, { query, data })

    if (!category) {
      throw new ApiError(messages.ERROR.BOOKMARK_COLLECTION_NOT_FOUND, httpStatus.NOT_FOUND)
    }

    return category
  } catch (error) {
    throw new ApiError(
      error.message,
      error.statusCode || httpStatus.INTERNAL_SERVER_ERROR
    )
  }
}

exports.createBookmark = (body) => {
  const data = {
    ...body,
  }
  return DbRepo.create(collections.BOOKMARK, { data })
}

exports.getBookmarkCollection = (query = {}, data = { _id: 1 }) => {
  return DbRepo.findOne(collections.BOOKMARK, { query, data })
}

exports.getBookmarkCollectionByTitle = (title, data = {_id: 1})=> {
  const query = {
    title: {$regex: title, $options: 'i'}
  }
  return exports.getBookmarkCollection(query, data)
}


exports.deleteTitleDescription = (faqId = {}) => {
  const query = {
    _id: getObjectId(faqId),
  }

  return DbRepo.deleteOne(collections.BOOKMARK, { query })
}

exports.getAllBookmark = (data = { title: 1,}) => {
  return DbRepo.find(collections.BOOKMARK, { data })
}

exports.getStoryBookmark = (data = { title: 1,}) => {
  const pipline = [
    {
      $project:{
        title: 1,
        stories: 1,
        _id : 0,
        id : '$_id'
      }
    }
  ]
  return DbRepo.aggregate(collections.BOOKMARK, pipline)
}

exports.deleteBookmark = (bookmarkId = {}) => {
  const query = {
    _id: getObjectId(bookmarkId),
  }

  return DbRepo.deleteOne(collections.BOOKMARK, { query })
}

exports.addStoryBookmark = (collectionId, storyId) =>{

  const query = {
    _id: getObjectId(collectionId),
    stories: {$ne: getObjectId(storyId)}
  }

  const data = {
    $push: {  
      stories: getObjectId(storyId), 
    }
  }
  return DbRepo.updateOne(collections.BOOKMARK, { query, data })
}