var express = require('express');
var router = express.Router();
var projectModel = require('../model/project');

router.use(function (req, res, next) {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  next();
});

/**
 * @url project/add
 */
router.route('/add')
  .get(projectModel.renderAddProject);

/**
 * @url project/manage
 */
router.route('/manage')
  .get(projectModel.renderManageProject);

/**
 * @url project/edit
 */
router.route('/edit')
  .get(projectModel.renderEditProject);

module.exports = router;
