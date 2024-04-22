const { Schema, model } = require('mongoose')

const languageSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    imageKey: {
      type: String,
      required: true,
    },
  },
  {
    autoIndex: false,
    timestamps: true,
  }
)

module.exports = model('Language', languageSchema)
