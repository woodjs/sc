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
  .get(projectModel.renderAddProject)
  .post(projectModel.createProject);

/**
 * @url project/manage
 */
router.route('/manage')
  .get(projectModel.renderManageProject)
  .post(projectModel.manageProject);

/**
 * @url project/edit/:name
 */
router.route('/edit/:name')
  .get(projectModel.renderEditProject)
  .post(projectModel.editProject);

module.exports = router;
