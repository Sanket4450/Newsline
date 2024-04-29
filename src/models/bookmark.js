const { Schema, model } = require('mongoose')

const bookmarkCollectionSchema = new Schema(
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
    stories: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Story',
      },
    ],
  },
  {
    autoIndex: false,
    timestamps: true,
  }
)

module.exports = model('BookmarkCollection', bookmarkCollectionSchema)
