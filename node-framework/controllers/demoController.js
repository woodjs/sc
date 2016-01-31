var gu = require('guthrie-js');
var baseController = require('../core/baseController');
var demoModel = require('../models/demo/demoModel');
var config = {filters: [demoFilterFunc1, demoFilterFunc2]};
var demoController = new gu.controller.inherit(baseController, config);

demoController.actions = {
  index: {
    GET: function (req, res) {
      console.log('demoController action index 1');

      res.render('demo/index', {pageCode: 'demoIndex', title: 'controller: demo, action: index'});
    }
  },
  show: {
    GET: demoModel.test,
    POST: function (req, res) {},
    PUT: function (req, res) {},
    DELETE: function (req, res) {}
  }
};

demoController.on('actionExecuting', function (req, res, next) {
  console.log('demoController actionExecuting 1');
  next();
});

demoController.on('actionExecuting', function (req, res, next) {
  console.log('demoController actionExecuting 2');
  next();
});

demoController.on('actionExecuted', function (req, res, next) {
  console.log('demoController actionExecuted 1');
  next();
});

demoController.on('resultExecuting', function (req, res, next) {
  console.log('demoController resultExecuting 1');
  next();
});

demoController.on('resultExecuted', function (req, res, next) {
  console.log('demoController resultExecuted 1');
  next();
});

function demoFilterFunc1(req, res, next) {
  console.log('demoController demoFilterFunc 1');
  next();
}

function demoFilterFunc2(req, res, next) {
  console.log('demoController demoFilterFunc 2');
  next();
}

module.exports = demoController;