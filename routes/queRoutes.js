const express = require('express')
const router = express.Router()
const { ensureAuthenticated, redirectAuthenticated } = require('../config/authentication')
const Answer = require('../models/Answer')

// Load Question model
const Question = require('../models/Question')

// Ask Page
router.get('/', (req, res) => res.render('ask.html'))

// find all questions
router.get('/list', async (req, res) => {
  const ques = await Question.find({})

  res.render('home.html', { ques })
})

// Add a question page
router.get('/create', async (req, res) => {
  res.render('add-que.html')
})

// find a question
router.get('/:id', async (req, res) => {
  const { id } = req.params
  try {
    const que = await Question.findById(id)
    const ans = await Answer.find({ _question: id }).populate('_user')
    res.render('view-que.html', { que, ans })
  } catch (err) {
    console.log(err)
  }
})

// Ask question route
router.post('/create', ensureAuthenticated, async (req, res) => {
  const { question, category } = req.body

  const ques = new Question({ _user: req.user.id, question, category })
  await ques.save()

  req.flash('success_msg', 'The asked question has been published')
  res.redirect(`/question/${ques._id}`)
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
  const resp = await Question.findOne({ _id: req.params.id, upvotes: { $elemMatch: { $eq: req.user.id } } })
  if (resp) {
    await Question.findOneAndUpdate({ _id: req.params.id }, { $pull: { upvotes: req.user.id } })

    req.flash('error_msg', 'The upvote from this question has been removed.')
    res.redirect(`/question/${req.params.id}`)
  } else {
    await Question.findOneAndUpdate(
      { _id: req.params.id, upvotes: { $ne: req.user.id } },
      { $push: { upvotes: req.user.id }, $pull: { downvotes: req.user.id } }
    )

    req.flash('success_msg', 'The Question has been upvoted.')
    res.redirect(`/question/${req.params.id}`)
  }
})

// Downvote a question
router.post('/downvote/:id', ensureAuthenticated, async (req, res) => {
  const resp = await Question.findOne({ _id: req.params.id, downvotes: { $elemMatch: { $eq: req.user.id } } })

  if (resp) {
    await Question.findOneAndUpdate({ _id: req.params.id }, { $pull: { downvotes: req.user.id } })

    req.flash('error_msg', 'The downvote from this question has been removed.')
    res.redirect(`/question/${req.params.id}`)
  } else {
    await Question.findOneAndUpdate(
      { _id: req.params.id },
      { $push: { downvotes: req.user.id }, $pull: { upvotes: req.user.id } }
    )

    req.flash('success_msg', 'Downvote on this question is removed.')
    res.redirect(`/question/${req.params.id}`)
  }
})

module.exports = router
