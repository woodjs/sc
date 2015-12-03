var os = require('os');
var platform = os.platform();
var baseUrl = '';

if (platform.indexOf('dar') === -1) {
  baseUrl = 'D:\\nodejs_workspace\\optimizers\\';
} else {
  baseUrl = '/users/bugong/documents/optimizers/';
}
module.exports = baseUrl;
