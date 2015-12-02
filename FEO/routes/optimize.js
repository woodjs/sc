var express = require('express');
var router = express.Router();
var optimizeModel = require('../model/optimize');

router.use(function (req, res, next) {
  if (!req.session.user) {
    return res.redirect('/login');
  }

  next();
});

/**
 * @url /optimize
 */
router.route('/')
  .get(optimizeModel.renderOptimize);

module.exports = router;
