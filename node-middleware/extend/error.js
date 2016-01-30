var extendErrorPrototype = function () {
  var _self = this,
    moment = require('moment'),
    BaseMongoDB = require('../core/baseMongoDB');

  Error.prototype.publish = function () {
    var baseMongoDB = new BaseMongoDB(),
      errInfo = {
        name: this.name,
        errmsg: this.errmsg,
        message: this.message,
        stock: this.stack,
        createDate: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
      };

    baseMongoDB.insert('exception', errInfo, function (success) {
      if (!success) {
        console.log('write exception error message fail');
      }
      console.log(errInfo);
    }, true);
  };
};

module.exports = extendErrorPrototype;