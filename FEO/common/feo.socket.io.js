var os = require('os');
var io = require('socket.io');
var moment = require('moment');
var eol = os.EOL;
var socketIO = {
  listen: function (server) {
    var self = this;

    self.sio = io.listen(server);
    self.sio.sockets.on('connection', function (socket) {
      //socket.userid = UUID();
      setInterval(function () {
        var msg = moment().format('YYYY-MM-DD HH:mm:ss') + ' 优化了很多,请等待...' + eol;
        self.send(socket, msg);
      }, 1000);
    });
  },
  send: function (socket, msg) {
    var self = this;

    socket.emit('optimize message', msg);
  }
};

module.exports = socketIO;