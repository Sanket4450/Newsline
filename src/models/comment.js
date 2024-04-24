const { Schema, model } = require('mongoose')

const commentSchema = new Schema(
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
