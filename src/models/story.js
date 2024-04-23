const { Schema, model } = require('mongoose')

const storySchema = new Schema(
  {
    accountId: {
      type: Schema.Types.ObjectId,
      ref: 'Account',
      required: true,
    },
    title: {
      type: String,
      max: 100,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    coverImageKey: {
      type: String,
      required: true,
    },
    topicId: {
      type: Schema.Types.ObjectId,
      ref: 'Topic',
      required: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  {
    autoIndex: false,
    timestamps: true,
  }
)

module.exports = model('Story', storySchema)
