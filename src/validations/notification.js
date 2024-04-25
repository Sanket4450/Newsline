const joi = require('joi')

const { idReqValidation } = require('./common')

const deleteNotification = {
  params: joi.object({
    notificationId: idReqValidation,
  }),
}

module.exports = {
  deleteNotification,
}
