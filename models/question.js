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
    votes : [{
      type : Schema.Types.ObjectId,
    }],
    answers : [answerModel.schema]
  },
  { 
    usePushEach: true,
    timestamps: {} // auto generate createdAt and updatedAt field
  } 
)

module.exports = mongoose.model('Question', questionSchema)