var express = require('express');
var router = express.Router();
var checkModel = require('../model/check');

/**
 * @url /check
 */
router.route('/')
  .post(checkModel.check);

module.exports = router;
