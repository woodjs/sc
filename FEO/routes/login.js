var express = require('express');
var router = express.Router();
var loginModel = require('../model/login');

/**
 * @url /login
 */
router.route('/')
  .get(loginModel.renderLogin)
  .post(loginModel.checkUser);

module.exports = router;
