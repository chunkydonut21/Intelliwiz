const express = require('express')
const router = express.Router()
const { ensureAuthenticated, redirectAuthenticated } = require('../config/authentication')

// Load Answer model
const Answer = require('../models/Answer')

// Add an answer route
router.post('/:id', ensureAuthenticated, async (req, res) => {
  const { reply } = req.body
  try {
    const checkForExistingAns = await Answer.findOne({ _user: req.user.id, _question: req.params.id })

    if (checkForExistingAns) {
      req.flash('error_msg', 'You have already answered to the question.')
      return res.redirect(`/question/${req.params.id}`)
    }
    const ans = new Answer({ _user: req.user.id, _question: req.params.id, reply })
    await ans.save()

    req.flash('success_msg', 'The answer has been published.')
    res.redirect(`/question/${req.params.id}`)
  } catch (error) {
    console.log(error)
    res.status(404).json(err)
  }
})

// delete answer route
router.delete('/:id', ensureAuthenticated, async (req, res) => {
  const { id } = req.params.id

  await Answer.findByIdAndDelete({ _id: id, _user: req.user.id })

  req.flash('success_msg', 'The answer has been deleted.')
  res.redirect('/home')
})

// Upvote an answer
router.post('/upvote/:id', ensureAuthenticated, async (req, res) => {
  const resp = await Answer.findOne({ _id: req.body._answer, upvotes: { $elemMatch: { $eq: req.user.id } } })
  if (resp) {
    await Answer.findOneAndUpdate({ _id: req.body._answer }, { $pull: { upvotes: req.user.id } })

    req.flash('error_msg', 'The upvote from this answer has been removed.')
    res.redirect(`/question/${req.params.id}`)
  } else {
    await Answer.findOneAndUpdate(
      { _id: req.body._answer, upvotes: { $ne: req.user.id } },
      { $push: { upvotes: req.user.id }, $pull: { downvotes: req.user.id } }
    )

    req.flash('success_msg', 'The Answer has been upvoted.')
    res.redirect(`/question/${req.params.id}`)
  }
})

// Downvote an answer
router.post('/downvote/:id', ensureAuthenticated, async (req, res) => {
  const resp = await Answer.findOne({ _id: req.body._answer, downvotes: { $elemMatch: { $eq: req.user.id } } })

  if (resp) {
    await Answer.findOneAndUpdate({ _id: req.body._answer }, { $pull: { downvotes: req.user.id } })

    req.flash('success_msg', 'The downvote from this answer has been removed.')
    res.redirect(`/question/${req.params.id}`)
  } else {
    await Answer.findOneAndUpdate(
      { _id: req.body._answer },
      { $push: { downvotes: req.user.id }, $pull: { upvotes: req.user.id } }
    )

    req.flash('error_msg', 'The Answer has been downvoted.')
    res.redirect(`/question/${req.params.id}`)
  }
})
module.exports = router
