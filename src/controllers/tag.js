const httpStatus = require('http-status')
const folders = require('../constants/folders')
const { catchAsyncErrors } = require('../utils/catchAsyncErrors')
const ApiError = require('../utils/ApiError')
const { sendResponse } = require('../utils/responseHandler')
const messages = require('../constants/messages')
const { tagService } = require('../services')

exports.getTagSearch = catchAsyncErrors(async(req,res) =>{
  const tags = await tagService.gatTagFullSearch(req.body)
  return sendResponse(
    res,
    httpStatus.OK,
    { tags },
    messages.SUCCESS.TAG_FETCHED
  )
})
  