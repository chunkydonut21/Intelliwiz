module.exports = {
  ensureAuthenticated: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }

    req.flash('error_msg', 'You need to be authenticated to view this content')
    res.redirect('/login')
  },
  redirectAuthenticated: function (req, res, next) {
    if (!req.isAuthenticated()) return next()
    res.redirect('/')
  }
}
