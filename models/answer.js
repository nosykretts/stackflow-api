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
  {
    usePushEach: true,
    toJSON: { virtuals: true }, 
    timestamps: {} 
  } // auto generate createdAt and updatedAt field
)

function autoPol(next){
  this.populate('creator')
  next()
}

answerSchema.pre('findOne', autoPol)
answerSchema.pre('find', autoPol)

module.exports = mongoose.model('Answer', answerSchema)

