const { Schema, model } = require('mongoose')

const reportSchema = new Schema(
  {
    accountId: {
      type: Schema.Types.ObjectId,
      ref: 'Account',
      required: true,
    },
    storyId: {
      type: Schema.Types.ObjectId,
      ref: 'Story',
      required: true,
    },
    reportReasonId: {
      type: Schema.Types.ObjectId,
      ref: 'ReportReason',
      required: true,
    },
  },
  {
    autoIndex: false,
    timestamps: true,
  }
)

module.exports = model('Report', reportSchema)
