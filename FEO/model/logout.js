var logoutModel = {};
logoutModel.logout = function (req, res) {
  req.session.user = null;
  res.redirect('/login');
};

module.exports = logoutModel;