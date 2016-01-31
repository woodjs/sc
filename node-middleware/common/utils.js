var utils = {};
var NO_VALID_URLS = ['/login', '/register', '/demo/index', '/demo/show'];

utils.isNeedValid = function (url) {
  return NO_VALID_URLS.indexOf(url) === -1 ? true : false;
};

module.exports = utils;