var gu = require('guthrie-js');
var urlFilter = require('../common/urlFilter');
var baseController = new gu.controller.create();

baseController.on('actionExecuting', function (req, res, next) {
  if (urlFilter(req)) {
    next();
  } else {
    next();
  }
});

module.exports = baseController;