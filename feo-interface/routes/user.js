var express = require('express');
var router = express.Router();
var userModel = require('../model/user');

router.use(function (req, res, next) {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  next();
});

/**
 * @url user/add
 */
router.route('/add')
  .get(userModel.renderAddUser)
  .post(userModel.createUser);

/**
 * @url user/manage
 */
router.route('/manage')
  .get(userModel.renderManageUser)
  .post(userModel.manageUser);

/**
 * @url user/edit
 */
router.route('/edit')
  .get(userModel.renderEditUser)
  .post(userModel.editUser);

module.exports = router;
