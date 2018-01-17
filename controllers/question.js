const boom = require('boom')

const QuestionModel = require('../models/question')
const AnswerModel = require('../models/answer')

function manipulateQuestion(question, loggedInId = false) {
  console.log('----> boom', loggedInId)
  let questioniffy = JSON.parse(JSON.stringify(question))
  questioniffy.answers = questioniffy.answers || []
  const x = {
    ...questioniffy,
    canUpdate: loggedInId && questioniffy.creator._id == loggedInId,
    canDelete: loggedInId && questioniffy.creator._id == loggedInId,
    canVoteUp:
      loggedInId &&
      !(questioniffy.creator._id == loggedInId) &&
      questioniffy.upvoters.indexOf(loggedInId) == -1,
    canVoteDown:
      loggedInId &&
      !(questioniffy.creator._id == loggedInId) &&
      questioniffy.downvoters.indexOf(loggedInId) == -1,
    canAddAnswer : loggedInId && !questioniffy.answers.some(answer => {
      return answer.creator._id == loggedInId
    }),
    answers : questioniffy.answers.map(answer => {
      return {
        ...answer,
        canDelete: answer.creator._id == loggedInId,
        canVoteUp: !(answer.creator._id == loggedInId) && answer.upvoters.indexOf(loggedInId) == -1,
        canVoteDown: !(answer.creator._id == loggedInId) && answer.downvoters.indexOf(loggedInId) == -1,
      }
    })
    // votedByMe: questioniffy.votes.indexOf(loggedInId) >= 0,
  }
  console.log('---->',questioniffy,'<-----')

  console.log(x)
  return x
}

module.exports = {
  getQuestions: function(req, res, next) {
    QuestionModel.find()
      .sort({ createdAt: 'desc' })
      .lean()
      // .then(questions => {
      //   return questions.map(question =>
      //     manipulateQuestion(question, req.userId)
      //   )
      // })
      .then(questions =>
        res.status(200).json({
          message: 'Questions get success',
          data: questions,
        })
      )
      .catch(err => next(boom.boomify(err)))
  },
  getQuestion: function(req, res, next) {
    QuestionModel.findOne({
      _id: req.params.id,
    })
      .lean()
      .then(question => {
        if (!question) {
          return res.status(404).json({
            message: 'Question not found',
          })
        }
        res.status(200).json({
          message: 'Question get success',
          data: manipulateQuestion(question, req.userId),
        })
      })
      .catch(err => next(boom.boomify(err)))
  },
  createQuestion: (req, res, next) => {
    QuestionModel.create({
      creator: req.userId,
      photoUrl: req.photoUrl,
      caption: req.body.caption,
      description: req.body.description,
    })
      .then(question =>
        question
          .populate({
            path: 'creator',
            select: ['username', 'name'],
          })
          .execPopulate()
      )
      .then(question => {
        res.status(200).json({
          message: 'Question successfully created',
          data: manipulateQuestion(question.toJSON(), req.userId),
        })
      })
      .catch(err => next(boom.boomify(err)))
  },
  updateQuestion: function(req, res, next) {
    QuestionModel.findOneAndUpdate(
      {
        _id: req.params.id,
        creator: req.userId,
      },
      {
        caption: req.body.caption,
        description: req.body.description,
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
  toggleQuestionVote: function(req, res, next) {
    QuestionModel.findOne({
      _id: req.params.id,
    })
      .then(question => {
        if (!question || question.creator._id == req.userId) {
          // return res.status(404).json({
          //   message: 'Question not found or you cant vote your own questionx',
          // })
          throw new Error(
            'Question not found or you cant vote your own question'
          )
        } else {
          const isUpvote = req.body.direction === 'up'
          const isCurrentUpvoter = question.upvoters.indexOf(req.userId) >= 0
          const isCurrentDownvoter =
            question.downvoters.indexOf(req.userId) >= 0

          if (isUpvote && !isCurrentUpvoter) {
            question.downvoters.pull(req.userId)
            question.upvoters.push(req.userId)
          }
          if (!isUpvote && !isCurrentDownvoter) {
            question.downvoters.push(req.userId)
            question.upvoters.pull(req.userId)
          }
          return question.save()
        }
      })
      .then(question => {
        console.log('masuk trues ke then')
        res.status(200).send({
          message: 'Question upvote or downvote success',
          data: question,
        })
      })
      .catch(err => next(boom.boomify(err)))
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
