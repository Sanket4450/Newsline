const httpStatus = require('http-status')
const folders = require('../constants/folders')
const { catchAsyncErrors } = require('../utils/catchAsyncErrors')
const ApiError = require('../utils/ApiError')
const { sendResponse } = require('../utils/responseHandler')
const messages = require('../constants/messages')
const { faqCategoryService, fileService, faqService } = require('../services')

exports.createCategory = catchAsyncErrors(async (req, res) => {
  const body = req.body

  if (await faqCategoryService.getCategoryByTitle(body.title)) {
    throw new ApiError(
      messages.ERROR.CATEGORY_EXISTS_WITH_CATEGORYTITLE,
      httpStatus.BAD_REQUEST
    )
  }

  await faqCategoryService.createCategory(body)

  return sendResponse(res, httpStatus.OK, {}, messages.SUCCESS.CATEGORY_CREATED)
})

exports.deleteCategory = catchAsyncErrors(async (req, res) => {
  const { categoryId } = req.body

  await faqCategoryService.checkCategoryExistById(categoryId)

  await faqCategoryService.deleteCategory(categoryId)
  await faqService.deleteFaqsByCategory(categoryId)

  return sendResponse(res, httpStatus.OK, {}, messages.SUCCESS.CATEGORY_DELETED)
})

exports.updateCategory = catchAsyncErrors(async (req, res) => {
  const categoryId = req.body.categoryId;
  const body = req.body;

  const category = await faqCategoryService.getCategoryById(categoryId);
  if (!category) {
    throw new ApiError(
      messages.ERROR.CATEGORY_NOT_FOUND,
      httpStatus.NOT_FOUND
    );
  }

  if (body.title && (body.title !== category.title)) {
    const existingCategory = await faqCategoryService.getCategory({ title: body.title });
    if (existingCategory) {
      throw new ApiError(
        messages.ERROR.CATEGORY_EXISTS_WITH_CATEGORYTITLE,
        httpStatus.BAD_REQUEST
      );
    }
  }

  await faqCategoryService.updateCategoryById(categoryId, body);

  return sendResponse(res, httpStatus.OK, {}, messages.SUCCESS.CATEGORY_UPDATED);
});

exports.findCategory = catchAsyncErrors(async(req,res)=>{
  const data = await faqCategoryService.getAllCategory()
  return sendResponse(
    res,
    httpStatus.OK,
    { data },
    messages.SUCCESS.CATEGORY_FETCHED
  )
})
