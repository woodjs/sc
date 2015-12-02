var db = require('../config/db');
var projectSchema = require('../schema/project');
var projectModel = db.model('projects', projectSchema, 'projects');

/**
 * 渲染并返回增加项目（add_project）页面
 *
 * @param req
 * @param res
 */
projectModel.renderAddProject = function (req, res) {

  projectModel.getProjectNameList(renderHtml);

  function renderHtml(docs) {
    res.render('add_project', {
      title: '增加项目',
      curUser: {
        username: req.session.user.username,
        nickname: req.session.user.nickname,
        role: req.session.user.role
      },
      projectNameList: docs
    });
  }
};

/**
 * 渲染并返回项目管理（manage_project）页面
 *
 * @param req
 * @param res
 */
projectModel.renderManageProject = function (req, res) {

  renderHtml();

  function renderHtml(docs) {
    res.render('manage_project', {
      title: '项目管理',
      curUser: {
        username: req.session.user.username,
        nickname: req.session.user.nickname,
        role: req.session.user.role
      }
      //userList: docs
    });
  }
};

/**
 * 渲染并返回编辑项目（edit_project）页面
 *
 * @param req
 * @param res
 */
projectModel.renderEditProject = function (req, res) {

  renderHtml();

  function renderHtml(docs) {
    res.render('edit_project', {
      title: '编辑项目',
      curUser: {
        username: req.session.user.username,
        nickname: req.session.user.nickname,
        role: req.session.user.role
      }
    });
  }
};

/**
 * 返回用户列表（只包含projectName字段）
 *
 * @param {Function} callback
 */
projectModel.getProjectNameList = function (callback) {
  projectModel.find({}, {projectName: 1, _id: 0}, {}, function (err, docs) {
    if (err) {
      console.log(err);
    }
    callback && callback(docs);
  });
};

module.exports = projectModel;


