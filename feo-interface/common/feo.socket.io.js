var io = require('socket.io');
var ioClient = require('socket.io-client');
var service_url = require('../config/service_url');
var socketIO = {
  listen: function (server) {
    var self = this;

    self.sio = io.listen(server);

    self.sio.sockets.on('connection', function (socket) {
      socket.on('start optimize', function (projectName) {

        sioClient.emit('start optimize', projectName);

      });

      socket.on('stop optimize', function (projectName) {

        sioClient.emit('stop optimize', projectName);

      });

      var sioClient = ioClient.connect(service_url);

      sioClient.on('connect', function () {

        console.log('后端压缩服务连接成功！');

      });

      sioClient.on('optimize message', function (data) {

        socket.emit('optimize message', data);

      });

      sioClient.on('optimize stop', function (data) {

        socket.emit('optimize stop');

      });

    });
  }
};

module.exports = socketIO;