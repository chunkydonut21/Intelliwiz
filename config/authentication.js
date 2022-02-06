module.exports = {
  ensureAuthenticated: function (req, res, next) {
    if (req.isAuthenticated()) return next()
    req.flash('error_msg', 'You need to be authenticated to view this content')
    res.redirect('/users/login')
  },
  redirectAuthenticated: function (req, res, next) {
    if (!req.isAuthenticated()) return next()
    res.redirect('/home')
  }
}
