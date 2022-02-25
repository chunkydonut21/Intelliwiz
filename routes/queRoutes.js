const express = require('express')
const router = express.Router()
const { ensureAuthenticated, redirectAuthenticated } = require('../config/authentication')

// Load Question model
const Question = require('../models/Question')

// Ask Page
router.get('/', (req, res) => res.render('ask.html'))

// find all questions
router.get('/list', async (req, res) => {
  const ques = await Question.find({})

  res.render('home.html', { ques })
})

// find a question
router.get('/:id', async (req, res) => {
  const { id } = req.params.id

  const que = await Question.findById(id)

  res.render('ask.html', { que })
})

// Ask question route
router.post('/', ensureAuthenticated, async (req, res) => {
  const { question } = req.body

  const ques = new Question({ _user, question })
  await ques.save()

  req.flash('success_msg', 'The asked question has been published')
  res.redirect('/home')
})

// delete question route
router.delete('/:id', ensureAuthenticated, async (req, res) => {
  const { id } = req.params.id

  await Question.findByIdAndDelete({ _id: id })

  req.flash('success_msg', 'The asked question has been deleted.')
  res.redirect('/home')
})

// Upvote a question
router.post('/upvote/:id', ensureAuthenticated, async (req, res) => {
  await Question.findOneAndUpdate({ _id: req.params.id }, { $push: { upvotes: req.user.id } })

  req.flash('success_msg', 'The Question has been upvoted.')
  res.redirect('/home')
})

// Downvote a question
router.post('/downvote/:id', ensureAuthenticated, async (req, res) => {
  await Question.findOneAndUpdate({ _id: req.params.id }, { $pop: { upvotes: req.user.id } })

  req.flash('success_msg', 'The Question has been downvoted.')
  res.redirect('/home')
})

module.exports = router
