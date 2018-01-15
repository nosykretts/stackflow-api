const mongoose = require('mongoose')
const Schema = mongoose.Schema

let answerModel = require('./answer')

let questionSchema = new Schema(
  {
    creator : {
      type : Schema.Types.ObjectId,
      ref : 'User',
      required : true
    },
    caption: {
      type: String,
      required : true
    },
    upvoters : [{
      type : Schema.Types.ObjectId,
    }],
    downvoters : [{
      type : Schema.Types.ObjectId,
    }],
  },
  { 
    usePushEach: true,
    timestamps: {} // auto generate createdAt and updatedAt field
  } 
)

questionSchema.virtual('answers', {
  ref: 'Answer',
  localField: '_id',
  foreignField: 'question'
})

module.exports = mongoose.model('Question', questionSchema)