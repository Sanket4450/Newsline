const joi = require('joi')

const {
  idReqValidation,
  pageAndLimit,
} = require('./common')

const reportStory = {
  body: joi.object({
    accountId: idReqValidation,
    storyId: idReqValidation,
    reportReasonId: idReqValidation,
  }),
}

const getReports = {
  query: joi.object({
    ...pageAndLimit,
  }),
}

const deleteReport = {
  body: joi.object({
    reportId: idReqValidation,
  }),
}

module.exports = {
  reportStory,
  getReports,
  deleteReport,
}
