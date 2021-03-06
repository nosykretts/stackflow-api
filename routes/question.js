const router = require('express').Router()
const authentication = require('../middlewares/authentication')
const {
  createQuestion,
  deleteQuestion,
  updateQuestion,
  getQuestions,
  getQuestion,
  toggleQuestionVote,
  
} = require('../controllers/question')

const {
  toggleAnswerVote,
  createAnswer,
  deleteAnswer,
} = require('../controllers/answer')

const publicAccess = function(req,res,next){
  req.publicAccess = true
  next()
}

router.get('/' , publicAccess, authentication, getQuestions)
router.get('/:id', publicAccess, authentication, getQuestion)
router.post('/', authentication, createQuestion)
router.put('/:id', authentication, updateQuestion)
router.put('/:id/togglevote',authentication, toggleQuestionVote)
router.post('/:id/answers', authentication, createAnswer)
router.put('/:id/answers/:answerId/togglevote',authentication, toggleAnswerVote)
router.delete('/:id/answers/:answerId', authentication, deleteAnswer)
router.delete('/:id', authentication, deleteQuestion)


module.exports = router