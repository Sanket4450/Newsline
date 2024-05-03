const joi = require('joi')

const {
  idReqValidation,
  pageAndLimit,
  stringValidation,
  idValidation,
} = require('./common')

const reportStory = {
  body: joi.object({
    storyId: idReqValidation,
    reportReasonId: idReqValidation,
  }),
}

const getReports = {
  body: joi.object({
    reportReasonId: idValidation,
    sortBy: stringValidation.valid('newest_first', 'oldest_first'),
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
