var app = require('express')(),
	http = require('http'),
	io = require('socket.io'),
	UUID = require('node-uuid'),
	cp = require('child_process'),
	logger = require('morgan'),
	config = require('./config.json');

var port = 8899,
	server = http.createServer(app).listen(port),
	sio = io.listen(server);

var childProcess = {};

// 建立socket连接
sio.sockets.on('connection', function(socket) {

	console.log('>>> connection socket success');

	socket.userid = UUID();

	// 开启优化
	socket.on('start optimizer', function(project) {
		try {
			var gulpFile = config.path + project + '\\gulpfile.js';
			var log = '>>> start optimizer...';

			console.log(log);
			socket.emit('optimize message', log + '\n');

			if (!childProcess[project]) {
				childProcess[project] = cp.fork(gulpFile);

				childProcess[project].on('message', function(m) {
					console.log(m);
					socket.emit('optimize message', m + '\n');
				});

				childProcess[project].on('exit', function() {
					socket.emit('optimize stop');
					delete childProcess[project];
				});
			} else {
				socket.emit('optimize message', ">>> " + project + ' project Is optimized....\n');
			}
		} catch (err) {
			socket.emit('optimize message', err);
		}
	});

	// 停止优化
	socket.on('stop optimizer', function(project) {
		var log = '>>> stop optimizer';

		console.log(log);
		socket.emit('optimize message', log + '\n');

		if (childProcess[project]) {
			childProcess[project].kill();
		}
	});
});

console.log('feo-services server start success port:' + port)