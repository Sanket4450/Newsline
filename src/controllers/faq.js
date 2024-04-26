const httpStatus = require('http-status')
const { catchAsyncErrors } = require('../utils/catchAsyncErrors')
const { sendResponse } = require('../utils/responseHandler')
const messages = require('../constants/messages')
const { faqService, faqCategoryService } = require('../services')

exports.getFaqs = catchAsyncErrors(async (req, res) => {
  const body = req.body

  if (body.faqCategoryId) {
    await faqCategoryService.checkCategoryExistById(body.faqCategoryId)
  }
  const faqs = await faqService.getFaqs(body)

  return sendResponse(
    res,
    httpStatus.OK,
    { faqs },
    messages.SUCCESS.FAQS_FETCHED
  )
})

exports.createFaq = catchAsyncErrors(async (req, res) => {
  const body = req.body

  await faqCategoryService.checkCategoryExistById(body.faqCategoryId)

  await faqService.createFaq(body)

  return sendResponse(res, httpStatus.OK, {}, messages.SUCCESS.FAQ_CREATED)
})

exports.updateFaq = catchAsyncErrors(async (req, res) => {
  const { faqId, ...updateBody } = req.body

  await faqService.checkFaqExistById(faqId)

  await faqService.updateFaq(faqId, updateBody)

  return sendResponse(res, httpStatus.OK, {}, messages.SUCCESS.FAQ_UPDATED)
})

exports.deleteFaq = catchAsyncErrors(async (req, res) => {
  const { faqId } = req.body

  await faqService.checkFaqExistById(faqId)

  await faqService.deleteFaq(faqId)

  return sendResponse(res, httpStatus.OK, {}, messages.SUCCESS.FAQ_DELETED)
})
