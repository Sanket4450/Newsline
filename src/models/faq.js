const { mongoose, model } = require('mongoose')

const faqSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    faqCategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FaqCategory',
      required: true,
    }
  }
)

module.exports = model('Faq', faqSchema)
