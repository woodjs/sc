var os = require('os');
var platform = os.platform();
var baseUrl = '';

if (platform.indexOf('win') > -1) {
  baseUrl = 'D:\\nodejs_workspace\\optimizers\\';
} else {
  baseUrl = '~/documents/optimizers/';
}
module.exports = baseUrl;
