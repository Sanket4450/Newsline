const { Schema, model } = require('mongoose')

const sessionSchema = new Schema({
  accountId: {
    type: Schema.Types.ObjectId,
    ref: 'Account',
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
})

module.exports = model('Session', sessionSchema)
