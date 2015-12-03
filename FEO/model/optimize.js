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
      //TODO
      console.log('action:'+ obj.projectName +'，执行优化操作！');
      res.send({
        status: 200
      });
      break;
    case 'cancel':
      //TODO
      console.log('cancel:'+ obj.projectName +'，取消执行优化操作！');
      res.send({
        status: 200
      });
      break;
    default:
      console.log('when step into this line! means some error happened!');
  }
};




module.exports = optimizeModel;


