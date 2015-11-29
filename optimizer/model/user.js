var db = require('../config/db');
var userSchema = require('../schema/user');
var userModel = db.model('users', userSchema, 'users');

module.exports = userModel;


