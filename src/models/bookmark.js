const { Schema, model } = require('mongoose')

const bookmarkSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    accountId: 
      {
        type: Schema.Types.ObjectId,
        ref: 'Account',
      },
    stories: [
      {
         type: Schema.Types.ObjectId,
         ref: 'Story'
      }
   ],
  }
)

module.exports = model('BookmarkCollection', bookmarkSchema)
