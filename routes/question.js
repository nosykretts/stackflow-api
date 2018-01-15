const router = require('express').Router()
const authentication = require('../middlewares/authentication')
const {
  createQuestion,
  deleteQuestion,
  updateCaption,
  getQuestions,
  createAnswer,
  deleteAnswer,
  toggleQuestionVote,
  toggleAnswerVote
} = require('../controllers/question')

router.get('/', authentication, getQuestions)
router.post('/', authentication, createQuestion)
router.put('/:id/togglequestionvote',authentication, toggleQuestionVote)
router.put('/:id/toggleanswervote',authentication, toggleAnswerVote)
router.put('/:id/updatecaption', authentication, updateCaption)
router.post('/:id/answers', authentication, createAnswer)
router.delete('/:id/answers/:answerId', authentication, deleteAnswer)
router.delete('/:id', authentication, deleteQuestion)


module.exports = router