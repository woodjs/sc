var moment = require('moment');
var projectModel = require('./project');
var optimizeModel = {};

/**
 * 渲染并返回项目优化（optimize）页面
 *
 * @param req
 * @param res
 */
optimizeModel.renderOptimize = function (req, res) {

  projectModel.getProjectList(renderHtml);

  function renderHtml(docs) {
    res.render('optimize', {
      title: '项目优化',
      curUser: {
        username: req.session.user.username,
        nickname: req.session.user.nickname,
        role: req.session.user.role
      },
      projectList: docs
    });
  }
};

/**
 * 执行优化相关的操作
 *
 * @param req
 * @param res
 */
optimizeModel.manageOptimize = function (req, res) {
  var obj = req.body;
  var type = obj.type;

  switch (type) {
    case 'action':
      var optimizeTime = moment().format('YYYY-MM-DD HH:mm:ss');
      projectModel.update({projectName: obj.projectName, isOptimizing: false}, {
        $set: {
          lastOptimizeTime: optimizeTime,
          lastOptimizeBy: req.session.user.username,
          isOptimizing: true
        }
      }, {}, function (err, docs) {
        if (err) {
          console.log(err);
        }
        if (docs[0]) {
          res.send({
            status: 200,
            optimizeTime: optimizeTime,
            optimizeBy: req.session.user.username
          });
        } else {
          res.send({
            status: 201
          });
        }
      });
      break;
    case 'cancel':
      projectModel.update({projectName: obj.projectName, isOptimizing: true}, {
        $set: {
          isOptimizing: false
        }
      }, {}, function (err, docs) {
        if (err) {
          console.log(err);
        }
        if (docs[0]) {
          res.send({
            status: 200
          });
        } else {
          res.send({
            status: 201
          });
        }
      });
      break;
    default:
      console.log('when step into this line! means some error happened!');
  }
};




module.exports = optimizeModel;


