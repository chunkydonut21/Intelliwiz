const express = require('express')
const router = express.Router()
const { ensureAuthenticated, redirectAuthenticated } = require('../config/authentication')

// Load Comment model
const Comment = require('../models/Comment')

// find all comments
router.get('/:id', async (req, res) => {
  console.log(req.params.id)
  const { id } = req.params

  const comments = await Comment.find({ _answer: id }).populate('_user')
  console.log(comments)
  res.send(comments)
})

// Add a comment route
router.post('/:id/:ansId', ensureAuthenticated, async (req, res) => {
  const { reply } = req.body
  const { id, ansId } = req.params

  const ans = new Comment({ _user: req.user.id, _answer: ansId, reply })
  await ans.save()

  req.flash('success_msg', 'The comment has been added.')

  res.redirect(`/question/${id}`)
})

// delete comment route
router.delete('/:id', ensureAuthenticated, async (req, res) => {
  const { id } = req.params.id

  await Comment.findByIdAndDelete({ _id: id, _user: req.user.id })

  req.flash('success_msg', 'The comment has been deleted.')
  res.redirect('/home')
})

module.exports = router
