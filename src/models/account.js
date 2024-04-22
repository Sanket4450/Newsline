const { Schema, model } = require('mongoose')

const accountSchema = new Schema(
  {
    fullName: {
      type: String,
    },
    userName: {
      type: String,
      index: true,
    },
    profileImageKey: {
      type: String,
    },
    email: {
      type: String,
      required: true,
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
    isWriter: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      enum: ['reader', 'author', 'publisher'],
      default: 'reader',
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    isProfileCompleted: {
      type: Boolean,
      default: false,
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
  },
  {
    autoIndex: false,
    timestamps: true,
  }
)

module.exports = model('Account', accountSchema)
