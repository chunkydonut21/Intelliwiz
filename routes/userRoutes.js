const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const passport = require('passport')
const { ensureAuthenticated, redirectAuthenticated } = require('../config/authentication')

// Load User model
const User = require('../models/User')

// Login Page
router.get('/login', redirectAuthenticated, (req, res) => res.render('login'))

// Register Page
router.get('/register', redirectAuthenticated, (req, res) => res.render('register'))

// Register
router.post('/register', async (req, res) => {
  const { name, userName, email, password, confirmPassword } = req.body

  let errors = []

  if (!name || !userName || !email || !password || !confirmPassword) {
    errors.push({ msg: 'Please enter all fields' })
  }

  if (password != confirmPassword) {
    errors.push({ msg: 'Passwords do not match' })
  }

  if (password.length < 8) {
    errors.push({ msg: 'Password must be at least 8 characters' })
  }

  if (errors.length > 0) {
    return res.render('register', { errors, name, userName, email, password, confirmPassword })
  }

  // check if userr already exists
  const user = await User.findOne({ email })
  if (user) {
    errors.push({ msg: 'Email already exists' })
    res.render('register', { errors, name, userName, password, confirmPassword })
  }

  const pass = await bcrypt.hashSync(password, bcrypt.genSaltSync(10))

  const newUser = new User({ name, email, userName, password: pass })

  await newUser.save()

  req.flash('success_msg', 'You are now registered and can log in')
  res.redirect('/users/login')
})

// Login
router.post('/login', passport.authenticate('local', { failureRedirect: '/users/login' }), function (req, res) {
  res.redirect('/home')
})

// Logout userr
router.get('/logout', (req, res) => {
  req.logout()
  req.flash('success_msg', 'You are successfully logged out')
  res.redirect('/users/login')
})

module.exports = router
