var gu = require('guthrie-js');
//var gu = require('guthrie');
var baseController = require('../base/baseController');
var demoModel = require('../models/demo/demoModel');
var demoController = new gu.controller.inherit(baseController);

demoController.actions = {
  index: {
    GET: function (req, res) {
      res.send('demo index !');
    }
  },
  show: {
    GET: function (req, res) {
      res.send({'first': 'hello, here is guthrie-js !'});
    },
    POST: function (req, res) {

    },
    PUT: function (req, res) {

    },
    DELETE: function (req, res) {

    }
  }
};

module.exports = demoController;