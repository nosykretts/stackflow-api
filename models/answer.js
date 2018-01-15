const mongoose = require('mongoose')
const Schema = mongoose.Schema


let answerSchema = new Schema(
  {
    question: {
      type : Schema.Types.ObjectId,
      ref: 'Question',
      required : true
    },
    creator : {
      type : Schema.Types.ObjectId,
      ref : 'User',
      required : true
    },
    caption: {
      type: String,
      required : true
    },
    upvoters: [{
      type: Schema.Types.ObjectId,
    }],
    downvoters: [{
      type: Schema.Types.ObjectId,
    }],
  },
  { timestamps: {} } // auto generate createdAt and updatedAt field
)


module.exports = mongoose.model('Answer', answerSchema)

