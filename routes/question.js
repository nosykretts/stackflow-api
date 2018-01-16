const router = require('express').Router()
const authentication = require('../middlewares/authentication')
const {
  createQuestion,
  deleteQuestion,
  updateCaption,
  getQuestions,
  getQuestion,
  toggleQuestionVote,
  
} = require('../controllers/question')

const {
  toggleAnswerVote,
  createAnswer,
  deleteAnswer,
} = require('../controllers/answer')

router.get('/', authentication, getQuestions)
router.get('/:id', authentication, getQuestion)
router.post('/', authentication, createQuestion)
router.put('/:id/togglevote',authentication, toggleQuestionVote)
router.put('/:id/updatecaption', authentication, updateCaption)
router.post('/:id/answers', authentication, createAnswer)
router.put('/:id/answers/:answerId/togglevote',authentication, toggleAnswerVote)
router.delete('/:id/answers/:answerId', authentication, deleteAnswer)
router.delete('/:id', authentication, deleteQuestion)


module.exports = router