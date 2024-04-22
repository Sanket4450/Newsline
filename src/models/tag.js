const { Schema, model } = require('mongoose')

const tagSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    postsCount: {
      type: Number,
      default: 0,
    },
  },
  {
    autoIndex: false,
    timestamps: true,
  }
)

module.exports = model('Tag', tagSchema)
