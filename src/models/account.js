const { Schema, model } = require('mongoose')

const accountSchema = new Schema({
  fullName: {
    type: String,
  },
  userName: {
    type: String,
  },
  profileImageKey: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    index: true,
  },
  password: {
    type: String,
    required: true,
  },
  mobile: {
    type: Number,
    index: true,
  },
  dateOfBirth: {
    type: Date,
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
  },
  country: {
    type: String,
  },
  bio: {
    type: String,
    max: 200,
  },
  website: {
    type: String,
  },
  language: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Language',
  },
  type: {
    type: String,
    enum: ['author', 'publisher'],
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  interests: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Topic',
    },
  ],
  followingAccounts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account',
    },
  ],
  followingTags: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tag',
    },
  ],
})

module.exports = model('Account', accountSchema)
