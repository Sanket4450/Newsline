const { Schema, model } = require('mongoose')

const faqCategorySchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    }
  }
)

module.exports = model('FaqCategory', faqCategorySchema)
