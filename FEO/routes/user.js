var express = require('express');
var router = express.Router();
var userModel = require('../model/user');

/**
 * @url user/addUser
 */
router.route('/addUser')
  .get(userModel.renderAddUser)
  .post(userModel.createUser);

/**
 * @url user/manageUser
 */
router.route('/manageUser')
  .get(userModel.renderManageUser)
  .post(userModel.manageUser);

/**
 * @url user/editUser
 */
router.route('/editUser')
  .get(userModel.renderEditUser)
  .post(userModel.editUser);

module.exports = router;
