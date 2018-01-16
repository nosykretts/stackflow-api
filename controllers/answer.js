const boom = require('boom')

const QuestionModel = require('../models/question')
const AnswerModel = require('../models/answer')


module.exports = {
  createAnswer: function(req, res, next) {
    AnswerModel.create({
      question: req.params.id,
      creator: req.userId,
      caption: req.body.caption,
    })
      .then(answer => answer.populate('creator').execPopulate())
      .then(answer => {
        res.status(200).json({
          message: 'Answers successfully created',
          data: answer,
        })
      })
      .catch(err => next(boom.boomify(err)))
  },
  deleteAnswer: function(req, res, next) {
    AnswerModel.findOneAndRemove({
      question: req.params.id,
      _id: req.params.answerId,
    })
      .then(answer => {
        if (!answer) {
          return res.status(404).json({
            message: 'Answer not found',
          })
        }
        res.status(200).json({
          message: 'Answer successfully deleted',
          data: answer,
        })
      })
      .catch(err => next(boom.boomify(err)))
  },
  toggleAnswerVote: function(req, res, next) {
    AnswerModel.findOne({
      _id: req.params.answerId,
      question: req.params.id
    })
      .then(answer => {
        console.log(answer.creator._id , req.userId)
        if (!answer || answer.creator._id == req.userId) {
          return res.status(404).json({
            message: 'answer not found or you cant vote your own answer',
          })
        }
        const isUpvote = req.body.direction === 'up'
        const isCurrentUpvoter = answer.upvoters.indexOf(req.userId) >= 0
        const isCurrentDownvoter = answer.downvoters.indexOf(req.userId) >= 0

        if (isUpvote && !isCurrentUpvoter) {
          answer.downvoters.pull(req.userId)
          answer.upvoters.push(req.userId)
        } 
        if(!isUpvote && !isCurrentDownvoter) {
          answer.downvoters.push(req.userId)
          answer.upvoters.pull(req.userId)
        }
        return answer.save()
      })
      
      .then(answer => {
        res.status(200).json({
          message: 'answer upvote or downvote success',
          data: answer,
        })
      })
      .catch(err => next(boom.boomify(err)))
  },
}