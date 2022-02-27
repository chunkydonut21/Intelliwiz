const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const passport = require('passport')
const { ensureAuthenticated, redirectAuthenticated } = require('../config/authentication')

// Load User model
const User = require('../models/User')
const generateUserName = require('../utils/generateUser')
const Question = require('../models/Question')

// find all questions
router.get('/', async (req, res) => {
  const ques = await Question.find({}).populate('_user')

  res.render('home.html', { ques })
})

// Login Page
router.get('/login', redirectAuthenticated, (req, res) => res.render('login.html'))

// Register Page
router.get('/register', redirectAuthenticated, (req, res) => res.render('register.html'))

// Register
router.post('/register', async (req, res) => {
  const { name, email, password, confirm_password } = req.body

  let errors = []

  if (!name || !email || !password || !confirm_password) {
    errors.push({ msg: 'Please enter all fields' })
  }

  if (password != confirm_password) {
    errors.push({ msg: 'Passwords do not match' })
  }

  if (password.length < 8) {
    errors.push({ msg: 'Password must be at least 8 characters' })
  }

  if (errors.length > 0) {
    return res.render('register.html', { errors, name, email, password, confirm_password })
  }

  // check if userr already exists
  const user = await User.findOne({ email })
  if (user) {
    errors.push({ msg: 'Email already exists' })
    return res.render('register.html', { errors, name, password, confirm_password })
  }

  const pass = await bcrypt.hashSync(password, bcrypt.genSaltSync(10))

  const userName = await generateUserName(name.toLowerCase().replace(' ', '-'))
  const newUser = new User({ name, email, userName, password: pass })

  await newUser.save()

  req.flash('success_msg', 'You are now registered and can log in')
  res.redirect('/')
})

// Login
router.post('/login', async (req, res, next) => {
  console.log(req.body)
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
  })(req, res, next)
})

// Logout user
router.get('/logout', (req, res) => {
  req.logout()
  req.flash('success_msg', 'You are successfully logged out')
  res.redirect('/')
})

module.exports = router
