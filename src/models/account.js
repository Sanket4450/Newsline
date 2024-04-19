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
  resetPasswordOtp: {
    type: Number,
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
    type: Schema.Types.ObjectId,
    ref: 'Language',
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
    enum: ['author', 'publisher'],
    default: 'author',
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  interests: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Topic',
    },
  ],
  followingAccounts: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Account',
    },
  ],
  followingTags: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Tag',
    },
  ],
})

module.exports = model('Account', accountSchema)
