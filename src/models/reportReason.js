const { Schema, model } = require('mongoose')

const reportReasonSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
  },
  {
    autoIndex: false,
    timestamps: true,
  }
)

module.exports = model('ReportReason', reportReasonSchema)
