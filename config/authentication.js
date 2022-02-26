module.exports = {
  ensureAuthenticated: function (req, res, next) {
    if (req.isAuthenticated()) return next()
    console.log(req)
    req.flash('error_msg', 'You need to be authenticated to view this content')
    res.redirect('/')
  },
  redirectAuthenticated: function (req, res, next) {
    if (!req.isAuthenticated()) return next()
    res.redirect('/home')
  }
}
