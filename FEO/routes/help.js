var express = require('express');
var router = express.Router();
var helpModel = require('../model/help');

/**
 * @url /help
 */
router.route('/')
  .get(helpModel.renderHelp);

module.exports = router;
