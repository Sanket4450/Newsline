const { Schema, model } = require('mongoose')

const topicSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  iconKey: {
    type: String,
    required: true,
  },
})

module.exports = model('Topic', topicSchema)
