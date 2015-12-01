var express = require('express');
var router = express.Router();
var userModel = require('../model/user');

router.use(function (req, res, next) {
  if (!req.session.username) {
    return res.redirect('/login');
  }
  next();
});

/**
 * @url user/addUser
 */
router.route('/add')
  .get(userModel.renderAddUser)
  .post(userModel.createUser);

/**
 * @url user/manageUser
 */
router.route('/manage')
  .get(userModel.renderManageUser)
  .post(userModel.manageUser);

/**
 * @url user/editUser
 */
router.route('/edit')
  .get(userModel.renderEditUser)
  .post(userModel.editUser);

module.exports = router;
