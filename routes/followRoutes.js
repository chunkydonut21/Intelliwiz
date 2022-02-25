const express = require('express')
const router = express.Router()
const { ensureAuthenticated, redirectAuthenticated } = require('../config/authentication')

// Load Follow model
const Follow = require('../models/Follow')

// list all followers
router.get('/followers', async (req, res) => {
  const { id } = req.params.id

  const followers = await Follow.find({ _user: id }).populate('followers')

  res.send(followers)
})

// list all following users
router.get('/following', async (req, res) => {
  const { id } = req.params.id

  const following = await Follow.find({ _user: id }).populate('following')

  res.send(following)
})

// Add a follower route
router.post('/', ensureAuthenticated, async (req, res) => {
  const { userId } = req.body

  await Follow.findOneAndUpdate({ _user: req.user.id }, { $push: { following: userId } })
  await Follow.findOneAndUpdate({ _user: userId }, { $push: { followers: req.user.id } })

  req.flash('success_msg', 'The follower has been added.')
  res.redirect('/home')
})

// remove follow route
router.delete('/:id', ensureAuthenticated, async (req, res) => {
  const { userId } = req.params.id

  await Follow.findOneAndUpdate({ _user: req.user.id }, { $pop: { followers: userId } })
  await Follow.findOneAndUpdate({ _user: userId }, { $push: { followers: req.user.id } })

  req.flash('success_msg', 'The follower has been removed.')
  res.redirect('/home')
})

module.exports = router
