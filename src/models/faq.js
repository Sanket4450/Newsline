const { Schema, model } = require('mongoose')

const faqSchema = new Schema(
  {
    faqCategoryId: {
      type: Schema.Types.ObjectId,
      ref: 'FaqCategory',
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
  },
  {
    autoIndex: false,
    timestamps: true,
  }
)

module.exports = model('Faq', faqSchema)
