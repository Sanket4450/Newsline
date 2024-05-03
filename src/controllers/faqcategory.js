const httpStatus = require('http-status')
const { catchAsyncErrors } = require('../utils/catchAsyncErrors')
const ApiError = require('../utils/ApiError')
const { sendResponse } = require('../utils/responseHandler')
const messages = require('../constants/messages')
const { faqCategoryService, faqService } = require('../services')

exports.getFaqCategories = catchAsyncErrors(async (_, res) => {
  let faqCategories = await faqCategoryService.getAllCategories()

  faqCategories = faqCategories.map((category) => ({
    id: category._id,
    title: category.title,
  }))

  return sendResponse(
    res,
    httpStatus.OK,
    { faqCategories },
    messages.SUCCESS.FAQ_CATEGORIES_FETCHED
  )
})

exports.createFaqCategory = catchAsyncErrors(async (req, res) => {
  const body = req.body

  if (await faqCategoryService.getCategoryByTitle(body.title)) {
    throw new ApiError(
      messages.ERROR.FAQ_CATEGORY_EXISTS_WITH_TITLE,
      httpStatus.BAD_REQUEST
    )
  }

  await faqCategoryService.createCategory(body)

  return sendResponse(
    res,
    httpStatus.OK,
    {},
    messages.SUCCESS.FAQ_CATEGORY_CREATED
  )
})

exports.updateFaqCategory = catchAsyncErrors(async (req, res) => {
  const { faqCategoryId, ...updateBody } = req.body

  await faqCategoryService.checkCategoryExistById(faqCategoryId)

  if (
    updateBody.title &&
    (await faqCategoryService.getCategoryByTitle(updateBody.title))
  ) {
    throw new ApiError(
      messages.ERROR.FAQ_CATEGORY_EXISTS_WITH_TITLE,
      httpStatus.BAD_REQUEST
    )
  }

  await faqCategoryService.updateCategoryById(faqCategoryId, updateBody)

  return sendResponse(
    res,
    httpStatus.OK,
    {},
    messages.SUCCESS.FAQ_CATEGORY_UPDATED
  )
})

exports.deleteFaqCategory = catchAsyncErrors(async (req, res) => {
  const { faqCategoryId } = req.body

  await faqCategoryService.checkCategoryExistById(faqCategoryId)

  await faqCategoryService.deleteCategory(faqCategoryId)
  await faqService.deleteFaqsByCategory(faqCategoryId)

  return sendResponse(
    res,
    httpStatus.OK,
    {},
    messages.SUCCESS.FAQ_CATEGORY_DELETED
  )
})
