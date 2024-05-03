const joi = require('joi')

const {
  stringReqValidation,
  idReqValidation,
  stringValidation,
} = require('./common')

const createReportReason = {
  body: joi.object({
    title: stringReqValidation,
  }),
}

const updateReportReason = {
  body: joi.object({
    reportReasonId: idReqValidation,
    title: stringValidation,
  }),
}

const deleteReportReason = {
  body: joi.object({
    reportReasonId: idReqValidation,
  }),
}

module.exports = {
  createReportReason,
  updateReportReason,
  deleteReportReason,
}
