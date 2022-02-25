const express = require('express')
const router = express.Router()
const { ensureAuthenticated, redirectAuthenticated } = require('../config/authentication')

// Load Comment model
const Comment = require('../models/Comment')

// find all comments
router.get('/', async (req, res) => {
  const { id } = req.params.id

  const comments = await Comment.find({ _answer: id }).populate('_answer')

  res.render('ask.html', { comments })
})

// Add a comment route
router.post('/', ensureAuthenticated, async (req, res) => {
  const { _answer, reply } = req.body

  const ans = new Comment({ _user: req.user.id, _answer, reply })
  await ans.save()

  req.flash('success_msg', 'The comment has been published.')
  res.redirect('/home')
})

// delete comment route
router.delete('/:id', ensureAuthenticated, async (req, res) => {
  const { id } = req.params.id

  await Comment.findByIdAndDelete({ _id: id, _user: req.user.id })

  req.flash('success_msg', 'The comment has been deleted.')
  res.redirect('/home')
})

module.exports = router
