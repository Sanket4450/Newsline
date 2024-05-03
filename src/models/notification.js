const { Schema, model } = require('mongoose')

const notificationSchema = new Schema(
  {
    accountId: {
      type: Schema.Types.ObjectId,
      ref: 'Account',
      required: true,
    },
    type: {
      type: String,
      enum: ['simple', 'publish', 'engage'],
      default: 'simple',
    },
    event: {
      type: String,
      enum: [
        'setupAccount',
        'followAccount',
        'uploadStory',
        'postComment',
        'likeComment',
        'postReply',
      ],
      required: true,
    },
    title: {
      type: String,
      required: true,
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
    storyId: {
      type: Schema.Types.ObjectId,
      ref: 'Story',
      default: null,
    },
    commentId: {
      type: Schema.Types.ObjectId,
      ref: 'Comment',
      default: null,
    },
    isFollowedBack: {
      type: Boolean,
      default: null,
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
