var db = require('../config/db');
var projectSchema = require('../schema/project');
var projectModel = db.model('projects', projectSchema, 'projects');

/**
 * 渲染并返回项目优化（optimize）页面
 *
 * @param req
 * @param res
 */
projectModel.renderOptimize = function (req, res) {

  renderHtml();
  function renderHtml(docs) {
    res.render('optimize', {
      title: '项目优化',
      curUser: {
        username: req.session.user.username,
        nickname: req.session.user.nickname,
        role: req.session.user.role
      }
    });
  }
};



module.exports = projectModel;


