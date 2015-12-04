var os = require('os');
var io = require('socket.io');
var moment = require('moment');
var eol = os.EOL;
var socketIO = {
  listen: function (server) {
    var self = this;

    self.socket = io(server);
    self.socket.on('connection', function () {
      setInterval(function () {
        var msg = moment().format('YYYY-MM-DD HH:mm:ss') + ' 优化了很多,请等待...' + eol;
        self.send(msg);
      }, 1000);
    });
  },
  send: function (msg) {
    var self = this;

    self.socket.emit('optimize message', msg);
  }
};

module.exports = socketIO;