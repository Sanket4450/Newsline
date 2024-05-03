const httpStatus = require('http-status')
const { catchAsyncErrors } = require('../utils/catchAsyncErrors')
const ApiError = require('../utils/ApiError')
const { sendResponse } = require('../utils/responseHandler')
const messages = require('../constants/messages')
const {
  faqCategoryService,
  faqService,
  reportReasonService,
} = require('../services')

exports.getReportReasons = catchAsyncErrors(async (_, res) => {
  let reportReasons = await reportReasonService.getAllReasons()

  reportReasons = reportReasons.map((reason) => ({
    id: reason._id,
    title: reason.title,
  }))

  return sendResponse(
    res,
    httpStatus.OK,
    { reportReasons },
    messages.SUCCESS.REPORT_REASONS_FETCHED
  )
})

exports.createReportReason = catchAsyncErrors(async (req, res) => {
  const body = req.body

  if (await reportReasonService.getReasonByTitle(body.title)) {
    throw new ApiError(
      messages.ERROR.REPORT_REASON_EXISTS_WITH_TITLE,
      httpStatus.BAD_REQUEST
    )
  }

  await reportReasonService.createReason(body)

  return sendResponse(
    res,
    httpStatus.OK,
    {},
    messages.SUCCESS.REPORT_REASON_CREATED
  )
})

exports.updateReportReason = catchAsyncErrors(async (req, res) => {
  const { reportReasonId, ...updateBody } = req.body

  await reportReasonService.checkReasonExistById(reportReasonId)

  if (
    updateBody.title &&
    (await reportReasonService.getReasonByTitle(updateBody.title))
  ) {
    throw new ApiError(
      messages.ERROR.REPORT_REASON_EXISTS_WITH_TITLE,
      httpStatus.BAD_REQUEST
    )
  }

  await reportReasonService.updateReasonById(reportReasonId, updateBody)

  return sendResponse(
    res,
    httpStatus.OK,
    {},
    messages.SUCCESS.REPORT_REASON_UPDATED
  )
})

exports.deleteReportReason = catchAsyncErrors(async (req, res) => {
  const { reportReasonId } = req.body

  await reportReasonService.checkReasonExistById(reportReasonId)

  await reportReasonService.deleteReason(reportReasonId)
//   await faqService.deleteFaqsByCategory(reportReasonId)

  return sendResponse(
    res,
    httpStatus.OK,
    {},
    messages.SUCCESS.REPORT_REASON_DELETED
  )
})
