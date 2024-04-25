const joi = require('joi')

const { idValidation } = require('./common')

const deleteNotification = {
  body: joi.object({
    notificationId: idValidation,
  }),
}

module.exports = {
  deleteNotification,
}
