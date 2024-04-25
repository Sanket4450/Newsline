const { Schema, model } = require('mongoose')

const notificationSchema = new Schema(
  {
    accountId: {
      type: Schema.Types.ObjectId,
      ref: 'Account',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['publish', 'engage', 'simple'],
      default: 'simple',
    },
    storyId: {
      type: Schema.Types.ObjectId,
      ref: 'Story',
      default: null,
    },
    iconKey: {
      type: String,
      default: null,
    },
    iconAccountId: {
      type: Schema.Types.ObjectId,
      ref: 'Account',
      default: null,
    },
    isFollow: {
      type: Boolean,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    autoIndex: false,
    timestamps: true,
  }
)

module.exports = model('Notification', notificationSchema)
