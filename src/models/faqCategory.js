const { Schema, model } = require('mongoose')

const faqCategorySchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
  },
  {
    autoIndex: false,
    timestamps: true,
  }
)

module.exports = model('FaqCategory', faqCategorySchema)
