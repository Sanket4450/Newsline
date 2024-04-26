const { Schema, model } = require('mongoose')

const commentSchema = new Schema(
  {
    type: {
      type: String,
      enum: ['comment', 'reply'],
      required: true,
    },
    accountId: {
      type: Schema.Types.ObjectId,
      ref: 'Account',
      required: true,
    },
    storyId: {
      type: Schema.Types.ObjectId,
      ref: 'Story',
    },
    commentId: {
      type: Schema.Types.ObjectId,
      ref: 'Comment',
    },
    content: {
      type: String,
      required: true,
    },
    likedBy: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Account',
      },
    ],
  },
  {
    autoIndex: false,
    timestamps: true,
  }
)

module.exports = model('Comment', commentSchema)
