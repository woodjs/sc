var moment = require('moment');
var connectString = require('../config').db.connectStringList[0];
var connectDb = require('../core/connectDb');
var db = connectDb(connectString);
var errorSchema = require('../schemas/errorSchema');
var errorModel = db && db.model('error', errorSchema, 'error');

var extendError = function () {
  Error.prototype.publish = function () {
    var errorInfo = {
      name: this.name,
      message: this.message,
      stack: this.stack,
      createTime: moment().format('YYYY-MM-DD HH:mm:ss')
    };

    if (errorModel) {
      var errorEntity = new errorModel(errorInfo);

      errorEntity.save();
    }
  };
};

module.exports = extendError;