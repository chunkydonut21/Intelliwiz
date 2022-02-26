const express = require('express')
const router = express.Router()
const { ensureAuthenticated, redirectAuthenticated } = require('../config/authentication')

// Load Answer model
const Answer = require('../models/Answer')

// find all answers
router.get('/:id', async (req, res) => {
  const { id } = req.params.id

  const answers = await Answer.find({ _question: id }).populate('_question')

  res.render('ask.html', { answers })
})

// Add an answer route
router.post('/:id', ensureAuthenticated, async (req, res) => {
  const { reply } = req.body

  const ans = new Answer({ _user: req.user.id, _question: req.params.id, reply })
  await ans.save()

  req.flash('success_msg', 'The answer has been published.')
  res.redirect(`/question/${req.params.id}`)
})

// delete answer route
router.delete('/:id', ensureAuthenticated, async (req, res) => {
  const { id } = req.params.id

  await Answer.findByIdAndDelete({ _id: id, _user: req.user.id })

  req.flash('success_msg', 'The answer has been deleted.')
  res.redirect('/home')
})

// Upvote an answer
router.post('/upvote', ensureAuthenticated, async (req, res) => {
  await Answer.findOneAndUpdate({ _id: req.body.id }, { $push: { upvotes: req.user.id } })

  req.flash('success_msg', 'The Answer has been upvoted.')
  res.redirect('/home')
})

// Downvote an answer
router.post('/downvote/:id', ensureAuthenticated, async (req, res) => {
  await Answer.findOneAndUpdate({ _id: req.body.id }, { $pop: { upvotes: req.user.id } })

  req.flash('success_msg', 'The Answer has been downvoted.')
  res.redirect('/home')
})

module.exports = router
