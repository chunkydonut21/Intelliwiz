const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')

// Load User model
const User = require('../models/User')

module.exports = function (passport) {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
      // Match user
      try {
        const user = await User.findOne({ email: email })
        if (!user) {
          return done(null, false, { message: 'That email is not registered' })
        }

        // Match password
        if (!bcrypt.compareSync(password, appUser.password)) {
          return done(null, false, { message: 'Password doesnt match' })
        } else {
          return done(null, user)
        }
      } catch (err) {}
    })
  )

  passport.serializeUser(function (user, done) {
    done(null, user.id)
  })

  passport.deserializeUser(function (id, done) {})
}
