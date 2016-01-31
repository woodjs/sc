var gu = require('guthrie-js');
var utils = require('../common/utils');
var config = {filters: [baseFilterFunc1, baseFilterFunc2]};
var baseController = new gu.controller.create(config);

baseController.actions = {
  index: {
    GET: function (req, res) {
      console.log('baseController action index 1');
    }
  },
  show: {
    GET: function (req, res) {
      this.baseControllerInfo = '在这里想覆盖baseController定义的属性,但是因为不执行本方法,所以无效!';
      console.log('baseController action show 1');
    }
  }
};

baseController.on('actionExecuting', function (req, res, next) {
  console.log('baseController actionExecuting 1');
  this.baseControllerInfo = '这是在baseController中定义的属性';

  if (utils.isNeedValid(req.url)) { //验证该路径是否需要登录才能访问
    res.send('need Login!');
  } else {
    next();
  }
});

baseController.on('actionExecuting', function (req, res, next) {
  console.log('baseController actionExecuting 2');
  next();
});

baseController.on('actionExecuted', function (req, res, next) {
  console.log('baseController actionExecuted 1');
  next();
});

baseController.on('resultExecuting', function (req, res, next) {
  console.log('baseController resultExecuting 1');
  next();
});

baseController.on('resultExecuted', function (req, res, next) {
  console.log('baseController resultExecuted 1');
  next();
});

function baseFilterFunc1(req, res, next) {
  console.log('baseController baseFilterFunc 1');
  next();
}

function baseFilterFunc2(req, res, next) {
  console.log('baseController baseFilterFunc 2');
  next();
}

module.exports = baseController;