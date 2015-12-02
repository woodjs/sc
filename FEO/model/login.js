var crypto = require('crypto');
var db = require('../config/db');
var userSchema = require('../schema/user');
var userModel = db.model('users', userSchema, 'users');
var loginModel = {};

/**
 * 用户登录验证
 *
 * @param req
 * @param res
 */
loginModel.checkUser = function (req, res) {
  var obj = req.body;
  console.log(obj);
  if (!(obj.username && obj.password)) {
    console.log('some fields is empty!');
    return;
  }
  var pwd = crypto.createHash('md5').update(obj.password).digest('hex');
  userModel.find({username: obj.username}, function (err, docs) {
    if (err) {
      console.log(err);
    }
    if (docs[0] && docs[0].password === pwd) {
      req.session.user = {
        username: docs[0].username,
        nickname: docs[0].nickname,
        role: docs[0].role
      };
      res.send(200, {
        message: 'ok'
      });
    } else {
      res.send(200, {
        message: '用户名或密码错误！'
      });
    }
  });
};

/**
 * 渲染并返回增加用户（add_user）页面
 *
 * @param req
 * @param res
 */
loginModel.renderLogin = function (req, res) {
  res.render('login', {
    title: '登录'
  });
};
module.exports = loginModel;


