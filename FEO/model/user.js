var crypto = require('crypto');
var moment = require('moment');
var db = require('../config/db');
var userSchema = require('../schema/user');
var userModel = db.model('users', userSchema, 'users');

/**
 * 渲染并返回增加用户（add_user）页面
 *
 * @param req
 * @param res
 */
userModel.renderAddUser = function (req, res) {

  if (!req.session.user.role) {//非管理员，跳转到上一个页面
    return res.redirect('back');
  }
  userModel.getUserNameList(renderHtml);

  function renderHtml(docs) {
    res.render('add_user', {
      title: '增加用户',
      curUser: {
        username: req.session.user.username,
        nickname: req.session.user.nickname,
        role: req.session.user.role
      },
      userNameList: docs
    });
  }
};

/**
 * 渲染并返回用户管理（manage_user）页面
 *
 * @param req
 * @param res
 */
userModel.renderManageUser = function (req, res) {

  if (!req.session.user.role) {//非管理员，跳转到上一个页面
    return res.redirect('back');
  }
  userModel.getUserList(renderHtml);

  function renderHtml(docs) {
    res.render('manage_user', {
      title: '用户管理',
      curUser: {
        username: req.session.user.username,
        nickname: req.session.user.nickname,
        role: req.session.user.role
      },
      userList: docs
    });
  }
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
        username: req.session.user.username,
        nickname: req.session.user.nickname,
        role: req.session.user.role
      }
    });
  }
};


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
    createTime: moment().format('YYYY-MM-DD HH:mm:ss'),
    createBy: req.session.user.username
  };
  userModel.create(doc, function (err, doc) {
    if (err) {
      console.log(err);
    }
    res.send({
      status: 200,
      message: 'ok'
    });
  });
};

/**
 * 用户管理
 *
 * @param req
 * @param res
 */
userModel.manageUser = function (req, res) {
  var obj = req.body;
  var type = obj.type;
  var reg = new RegExp(obj.search, 'g');
  var password = '';

  switch (type) {
    case 'some':
        userModel.find({'nickname': reg}, {_id: 0, password: 0}, {}, function (err, docs) {
          if (err) {
            console.log(err);
          }
          res.send({
            status: 200,
            userList: docs
          });
        });
      break;
    case 'all':
        userModel.find({}, {_id: 0, password: 0}, {}, function (err, docs) {
          if (err) {
            console.log(err);
          }
          res.send({
            status: 200,
            userList: docs
          });
        });
      break;
    case 'auth':
        userModel.update({username: obj.username}, {$set: {role: obj.role}}, {}, function (err, docs) {
          if (err) {
            console.log(err);
          }
          res.send({
            status: 200
          });
        });
      break;
    case 'delete':
        userModel.remove({username: obj.username}, function (err) {
          if (err) {
            console.log(err);
          }
          res.send({
            status: 200
          });
        });
      break;
    case 'reset':
        password = crypto.createHash('md5').update(obj.password).digest('hex');
        userModel.update({username: obj.username}, {$set: {password: password}}, {}, function (err, docs) {
          if (err) {
            console.log(err);
          }
          res.send({
            status: 200
          });
        });
      break;
    default:
      console.log('when step into this line! means some error happened!');
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
  var password = crypto.createHash('md5').update(obj.password).digest('hex');
  var doc = {
    username: req.session.user.username,
    nickname: obj.nickname.toString(),
    password: password
  };
  userModel.find({username: doc.username}, function (err, docs) {
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


