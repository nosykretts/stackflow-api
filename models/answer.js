const mongoose = require('mongoose')
const Schema = mongoose.Schema


let answerSchema = new Schema(
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
  },
  { timestamps: {} } // auto generate createdAt and updatedAt field
)


module.exports = mongoose.model('Answer', answerSchema)

