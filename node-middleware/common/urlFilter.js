var NO_VALID_URLS = ['/account/auth', '/register', '/downfile'];

var urlFilter = function(req) {

	if (NO_VALID_URLS.indexOf(req.url) > -1) {
		return true;
	}

	return false;
};

module.exports = urlFilter;