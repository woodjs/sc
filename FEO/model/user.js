var crypto = require('crypto');
var db = require('../config/db');
var userSchema = require('../schema/user');
var userModel = db.model('users', userSchema, 'users');

/**
 * 返回用户列表（包含所有字段）
 *
 * @param {Function } callback
 */
userModel.getUserList = function (callback) {
  userModel.find(function (err, docs) {
    if (err) {
      console.log(err);
    }
    callback && callback(docs);
  });
};

/**
 * 返回用户列表（只包含username字段）
 *
 * @param {Function} callback
 */
userModel.getUserNameList = function (callback) {
  userModel.find({}, {username: 1, _id: 0}, {}, function (err, docs) {
      if (err) {
        console.log(err);
      }
      callback && callback(docs);
    });
};

/**
 * 渲染并返回增加用户（add_user）页面
 *
 * @param req
 * @param res
 */
userModel.renderAddUser = function (req, res) {
  userModel.getUserNameList(renderHtml);

  function renderHtml(docs) {
    res.render('add_user', {
      title: '增加用户',
      curUser: {
        username: req.session.username
      },
      userNameList: docs
    });
  }
};

/**
 * 创建用户
 *
 * @param req
 * @param res
 */
userModel.createUser = function (req, res) {
  var obj = req.body;
  if (!(obj.username && obj.nickname && obj.password && obj.rePassword)) {
    console.log('some fields is empty!');
    return;
  }
  var pwd = crypto.createHash('md5').update(obj.password).digest('hex');
  var doc = {
    username: obj.username.toString(),
    password: pwd,
    nickname: obj.nickname.toString(),
    role: 0,
    createTime: Date.now(),
    createBy: req.session.username
  };
  userModel.create(doc, function (err, doc) {
    if (err) {
      console.log(err);
    }
    console.log(doc);
  });
};

/**
 * 渲染并返回用户管理（manage_user）页面
 *
 * @param req
 * @param res
 */
userModel.renderManageUser = function (req, res) {
  userModel.getUserNameList(renderHtml);

  function renderHtml(docs) {
    res.render('manage_user', {
      title: '用户管理',
      curUser: {
        username: req.session.username
      }
      //userNameList: docs
    });
  }
};

/**
 * 用户管理
 *
 * @param req
 * @param res
 */
userModel.manageUser = function (req, res) {
  var obj = req.body;

};

/**
 * 渲染并返回修改密码（edit_user）页面
 *
 * @param req
 * @param res
 */
userModel.renderEditUser = function (req, res) {
  userModel.getUserNameList(renderHtml);

  function renderHtml(docs) {
    res.render('edit_user', {
      title: '修改密码',
      curUser: {
        username: req.session.username
      }
      //userNameList: docs
    });
  }
};

/**
 * 修改密码
 *
 * @param req
 * @param res
 */
userModel.editUser = function (req, res) {
  var obj = req.body;
  if (!(obj.nickname && obj.prePassword &&  obj.password && obj.rePassword)) {
    console.log('some fields is empty!');
    return;
  }
  var prePassword = crypto.createHash('md5').update(obj.prePassword).digest('hex');
  var newPwd = crypto.createHash('md5').update(obj.password).digest('hex');
  var doc = {
    nickname: obj.nickname.toString(),
    password: newPwd
  };
  userModel.find({username: obj.username}, function (err, docs) {
    if (err) {
      console.log(err);
    }
    if (docs[0] && docs[0].password === prePassword) {
      docs[0].nickname = doc.nickname;
      docs[0].password = doc.password;
      docs[0].save(function (err) {
        if (err) {
          console.log(err);
        }
        res.send(200, {
          message: 'ok'
        });
      });

    } else {
      res.send(200, {
        message: '原始密码不正确，请重新输入！'
      });
    }
  });
};

module.exports = userModel;


