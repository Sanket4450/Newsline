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
  storageService,
} = require('../services')
const { getObjectId } = require('../utils/getObjectId')

exports.reportStory = catchAsyncErrors(async (req, res) => {
  const accountId = req.user.accountId
  const body = req.body

  await accountService.checkAccountExistById(accountId)
  await storyService.checkStoryExistById(body.storyId)
  await reportReasonService.checkReasonExistById(body.reportReasonId)

  if (
    await storyService.getStory({
      _id: getObjectId(body.storyId),
      accountId: getObjectId(accountId),
    })
  ) {
    throw new ApiError(
      messages.ERROR.CANNOT_REPORT_OWN_STORY,
      httpStatus.BAD_REQUEST
    )
  }

  if (
    await reportService.getReport({
      accountId: getObjectId(accountId),
      storyId: getObjectId(body.storyId),
      reportReasonId: getObjectId(body.reportReasonId),
    })
  ) {
    throw new ApiError(messages.ERROR.ALREADY_REPORTED, httpStatus.BAD_REQUEST)
  }

  await reportService.createReport(accountId, body)

  return sendResponse(res, httpStatus.OK, {}, messages.SUCCESS.STORY_REPORTED)
})

exports.getReports = catchAsyncErrors(async (req, res) => {
  const body = req.body

  if (body.reportReasonId) {
    await reportReasonService.checkReasonExistById(body.reportReasonId)
  }

  let reports = await reportService.getReports(body)

  reports = await Promise.all(
    reports.map(async (report) => {
      report.account.profileImageUrl = report.account.profileImageKey
        ? await storageService.getFileUrl(report.account.profileImageKey)
        : null

      report.story.coverImageUrl = report.story.coverImageKey
        ? await storageService.getFileUrl(report.story.coverImageKey)
        : null

      delete report.account.profileImageKey
      delete report.story.coverImageKey

      return report
    })
  )

  return sendResponse(
    res,
    httpStatus.OK,
    { reports },
    messages.SUCCESS.REPORTS_FETCHED
  )
})

exports.deleteReport = catchAsyncErrors(async (req, res) => {
  const { reportId } = req.body

  await reportService.checkReportExistById(reportId)

  await reportService.deleteReport(reportId)

  return sendResponse(res, httpStatus.OK, {}, messages.SUCCESS.REPORT_DELETED)
})
