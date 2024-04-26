const httpStatus = require('http-status')
const folders = require('../constants/folders')
const { catchAsyncErrors } = require('../utils/catchAsyncErrors')
const ApiError = require('../utils/ApiError')
const { sendResponse } = require('../utils/responseHandler')
const messages = require('../constants/messages')
const { faqService , fileService, faqCategoryService } = require('../services')

exports.createTitleDescription = catchAsyncErrors(async (req, res) => {
  const body = req.body

  await faqCategoryService.checkCategoryExistById(body.faqCategoryId)

  if (await faqService.getCategoryByTitle(body.title)) {
    throw new ApiError(
      messages.ERROR.CATEGORY_EXISTS_WITH_CATEGORYTITLE,
      httpStatus.BAD_REQUEST
    )
  }
  
  await faqService.createTitleDescription(body)

  return sendResponse(res, httpStatus.OK, {}, messages.SUCCESS.TITLE_DESCRIPTON_CREATED)
})

exports.deleteTitleDescription = catchAsyncErrors(async (req, res) => {
  const { faqId } = req.body

  await faqService.checkCategoryExistById(faqId)

  await faqService.deleteTitleDescription(faqId)

  return sendResponse(res, httpStatus.OK, {}, messages.SUCCESS.TITLE_DESCRIPTON_DELETED)
})

exports.updateTitleDescription = catchAsyncErrors(async (req, res) => {
  const faqId = req.body.faqId;
  const body = req.body;

  const category = await faqService.getCategoryById(faqId);
  if (!category) {
    throw new ApiError(
      messages.ERROR.CATEGORY_NOT_FOUND,
      httpStatus.NOT_FOUND
    );
  }

  if (body.title && (body.title !== category.title)) {
    const existingCategory = await faqService.getTitle({ title: body.title });
    if (existingCategory) {
      throw new ApiError(
        messages.ERROR.CATEGORY_EXISTS_WITH_CATEGORYTITLE,
        httpStatus.BAD_REQUEST
      );
    }
  }

  await faqService.updateTitleDescriptionById(faqId, body);

  return sendResponse(res, httpStatus.OK, {}, messages.SUCCESS.TITLE_DESCRIPTON_UPDATED);
});

exports.searchCategory = catchAsyncErrors(async(req,res)=>{
  const body = req.body

  if (body.faqCategoryId) {
    await faqCategoryService.checkCategoryExistById(body.faqCategoryId)
  }
  const faqs = await faqService.getFaqs(body)
  return sendResponse(
    res,
    httpStatus.OK,
    { faqs },
    messages.SUCCESS.SEARCH_FEATCHED
  )
})
