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
router.post('/:userId', ensureAuthenticated, async (req, res) => {
  const { userId } = req.params

  await Follow.findOneAndUpdate({ _user: req.user.id }, { $push: { following: userId } }, { upsert: true })
  await Follow.findOneAndUpdate({ _user: userId }, { $push: { followers: req.user.id } }, { upsert: true })

  req.flash('success_msg', 'The follower has been added.')
  res.redirect(`/profile/${userId}`)
})

// remove follow route
router.post('/unfollow/:userId', ensureAuthenticated, async (req, res) => {
  const { userId } = req.params

  await Follow.findOneAndUpdate({ _user: req.user.id }, { $pull: { following: userId } }, { upsert: true })
  await Follow.findOneAndUpdate({ _user: userId }, { $pull: { followers: req.user.id } }, { upsert: true })

  req.flash('success_msg', 'The follower has been removed.')
  res.redirect(`/profile/${userId}`)
})

module.exports = router
