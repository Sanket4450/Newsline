const httpStatus = require('http-status')
const { catchAsyncErrors } = require('../utils/catchAsyncErrors')
const ApiError = require('../utils/ApiError')
const { sendResponse } = require('../utils/responseHandler')
const messages = require('../constants/messages')
const {
  reportService,
  accountService,
  storyService,
  reportReasonService,
} = require('../services')
const { getObjectId } = require('../utils/getObjectId')

exports.reportStory = catchAsyncErrors(async (req, res) => {
  const body = req.body

  await accountService.checkAccountExistById(body.accountId)
  await storyService.checkStoryExistById(body.storyId)
  await reportReasonService.checkReasonExistById(body.reportReasonId)

  if (
    await storyService.getStory({
      _id: getObjectId(body.storyId),
      accountId: getObjectId(body.accountId),
    })
  ) {
    throw new ApiError(
      messages.ERROR.CANNOT_REPORT_OWN_STORY,
      httpStatus.BAD_REQUEST
    )
  }

  if (
    await reportService.getReport({
      accountId: getObjectId(body.accountId),
      storyId: getObjectId(body.storyId),
      reportReasonId: getObjectId(body.reportReasonId),
    })
  ) {
    throw new ApiError(messages.ERROR.ALREADY_REPORTED, httpStatus.BAD_REQUEST)
  }

  await reportService.createReport(body)

  return sendResponse(res, httpStatus.OK, {}, messages.SUCCESS.STORY_REPORTED)
})

exports.getReports = catchAsyncErrors(async (req, res) => {
  const { page, limit } = req.query

  const reports = await reportService.getReports(page, limit)

  return sendResponse(res, httpStatus.OK, { reports }, messages.SUCCESS.REPORTS)
})

exports.deleteReport = catchAsyncErrors(async (req, res) => {
  const { reportId } = req.body

  await reportService.checkReportExistById(reportId)

  await reportService.deleteReport(reportId)

  return sendResponse(res, httpStatus.OK, {}, messages.SUCCESS.REPORT_DELETED)
})
