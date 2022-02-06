/**
 * express - a minimalist framework for node.js
 * mongodb - non-relational database
 * path - used for handling the file path
 * connect-flash and express-session used for displaying error and success messages to the user after filling the form
 */
const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const passport = require('passport')
const flash = require('connect-flash')
const session = require('express-session')

const app = express()

// specifying the port
const port = 8089

// Passport Config
require('./config/passport')(passport)

// DB Config
const db = require('./config/keys').mongoURI

// Connect to MongoDB
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.log(err))

// built in middleware for express to handle incominng post request
app.use(express.urlencoded({ extended: true }))

// Express body parser
app.use(express.urlencoded({ extended: true }))

app.use(express.static(__dirname + '/public'))

// Express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
)

// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

// connect flash as a middlewar to show the error and success messages
app.use(flash())

// Global variables
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg')
  res.locals.error_msg = req.flash('error_msg')
  res.locals.error = req.flash('error')
  next()
})

// static files configuration for bootstrap, css, jquery and fontawesome icons
app.use(express.static(path.join(__dirname, 'public')))
app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')))
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')))
app.use('/js', express.static(path.join(__dirname, 'node_modules/jquery/dist')))
app.use('/stylesheets/fontawesome', express.static(path.join(__dirname, 'node_modules/@fortawesome/fontawesome-free')))

// setting up the view engine
app.set('views', __dirname + '/views')
app.set('view engine', 'ejs')
app.engine('html', require('ejs').renderFile)

app.use('/users', require('./routes/userRoutes'))

// listening the app on the specified port
app.listen(port, () => console.log(`App is running at port ${port}!`))
