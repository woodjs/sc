var http = require('http'),
	serverConfig = require('../config').server;

module.exports = function(opts, callback) {
	var _self = this;

	var options = {
		host: serverConfig.host,
		port: serverConfig.port,
		path: opts.path,
		method: opts.method || "GET",
		headers: {
			'Content-Type': opts.contentType || 'application/json',
			'Content-Length': Buffer.byteLength(JSON.stringify(opts.data || {}))
		}
	};

	var httpReq = http.request(options, function(response) {
		var result;

		response.setEncoding('utf8');

		response.on('data', function(chunk) {
			result += chunk;
		});

		response.on('end', function() {
			callback(result);
		});
	});

	httpReq.on('error', function(err) {
		err.publish();
	});

	httpReq.write(JSON.stringify(opts.data || {}));

	httpReq.end();
};