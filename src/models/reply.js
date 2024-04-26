const { Schema, model } = require('mongoose')

const replySchema = new Schema(
  {
    accountId: {
      type: Schema.Types.ObjectId,
      ref: 'Account',
      required: true,
    },
    commentId: {
      type: Schema.Types.ObjectId,
      ref: 'Comment',
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

module.exports = model('Reply', replySchema)
