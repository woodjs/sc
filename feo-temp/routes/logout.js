var express = require('express');
var router = express.Router();
var logoutModel = require('../model/logout');

/**
 * @url /logout
 */
router.route('/')
  .get(logoutModel.logout);

module.exports = router;
