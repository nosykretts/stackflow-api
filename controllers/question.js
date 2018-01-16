const boom = require('boom')

const QuestionModel = require('../models/question')
const AnswerModel = require('../models/answer')

function manipulateQuestion(question, loggedInId) {
  let questioniffy = JSON.parse(JSON.stringify(question))
  return {
    ...question,
    canEditQuestion: question.creator._id == loggedInId,
    canDeleteQuestion: question.creator._id == loggedInId,
    canVoteQuestion: question.creator._id != loggedInId,
    // votedByMe: questioniffy.votes.indexOf(loggedInId) >= 0,
  }
}

module.exports = {
  getQuestions: function(req, res, next) {
    QuestionModel.find()
      .sort({ createdAt: 'desc' })
      // .populate({
      //   path: 'creator',
      //   select: ['username', 'name'],
      // })
      // .populate({
      //   path: 'answers.creator',
      //   select: ['username', 'name'],
      // })
      // .populate({
      //   path: 'answers',
      //   populate: { path: 'creator', select: ['name'] }
      // })
      .lean()
      .then(questions => {
        return questions.map(question =>
          manipulateQuestion(question, req.userId)
        )
      })
      .then(questions =>
        res.status(200).json({
          message: 'Questions get success',
          data: questions,
        })
      )
      .catch(err => next(boom.boomify(err)))
  },
  createQuestion: (req, res, next) => {
    QuestionModel.create({
      creator: req.userId,
      photoUrl: req.photoUrl,
      caption: req.body.caption,
    })
      .then(question => {
        return question
          .populate({
            path: 'creator',
            select: ['username', 'name'],
          })
          .execPopulate()
      })
      .then(question => {
        res.status(200).json({
          message: 'Question successfully created',
          data: question,
        })
      })
      .catch(err => next(boom.boomify(err)))
  },
  createAnswer: function(req, res, next) {
    AnswerModel.create({
      question: req.params.id,
      creator: req.userId,
      caption: req.body.caption,
    })
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

  },
  toggleQuestionVote: function(req, res, next) {
    QuestionModel.findOne({
      _id: req.params.id,
    })
      .then(question => {
        if (!question || question.creator == req.userId) {
          return res.status(404).json({
            message: 'Question not found or you cant vote your own question',
          })
        }
        if (question.votes.indexOf(req.userId) >= 0) {
          question.votes.pull(req.userId)
        } else {
          question.votes.push(req.userId)
        }
        return question.save()
      })
      .then(question => {
        res.status(200).json({
          message: 'Question upvote or downvote success',
          data: question.votes,
        })
      })
      .catch(err => next(boom.boomify()))
  },
  updateCaption: function(req, res, next) {
    QuestionModel.findOneAndUpdate(
      {
        _id: req.params.id,
        creator: req.userId,
      },
      {
        caption: req.body.caption,
      },
      { new: true }
    ).then(question => {
      if (!question) {
        return res.status(404).json({
          message: 'Question not found',
        })
      }
      res.status(200).json({
        message: 'Question caption successfully updated',
        data: question,
      })
    })
  },
  deleteQuestion: function(req, res, next) {
    QuestionModel.findOneAndRemove({
      _id: req.params.id,
      creator: req.userId,
    })
      .then(question => {
        if (!question) {
          return res.status(404).json({
            message: 'Question not found',
          })
        }
        res.status(200).json({
          message: 'Question successfully deleted',
          data: question,
        })
      })
      .catch(err => next(boom.boomify(err)))
  },
}
