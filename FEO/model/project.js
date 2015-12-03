var fs = require('fs');
var path = require('path');
var db = require('../config/db');
var moment = require('moment');
var projectSchema = require('../schema/project');
var projectModel = db.model('projects', projectSchema, 'projects');
var userModel = require('./user');
var baseUrl = require('../config/baseUrl');

/**
 * 渲染并返回增加项目（add_project）页面
 *
 * @param req
 * @param res
 */
projectModel.renderAddProject = function (req, res) {

  projectModel.getProjectNameList(renderHtml);

  function renderHtml(docs) {
    res.render('add_project', {
      title: '增加项目',
      curUser: {
        username: req.session.user.username,
        nickname: req.session.user.nickname,
        role: req.session.user.role
      },
      projectNameList: docs
    });
  }
};

/**
 * 渲染并返回项目管理（manage_project）页面
 *
 * @param req
 * @param res
 */
projectModel.renderManageProject = function (req, res) {

  projectModel.getProjectList(renderHtml);

  function renderHtml(docs) {
    res.render('manage_project', {
      title: '项目管理',
      curUser: {
        username: req.session.user.username,
        nickname: req.session.user.nickname,
        role: req.session.user.role
      },
      projectList: docs
    });
  }
};

/**
 * 渲染并返回编辑项目（edit_project）页面
 *
 * @param req
 * @param res
 */
projectModel.renderEditProject = function (req, res) {
  var projectName = req.param('name');

  projectModel.getProjectFiles(projectName, renderHtml);

  function renderHtml(obj) {
    res.render('edit_project', {
      title: '编辑项目',
      curUser: {
        username: req.session.user.username,
        nickname: req.session.user.nickname,
        role: req.session.user.role
      },
      files: obj,
      projectName: projectName
    });
  }
};

/**
 * 返回项目列表（只包含projectName字段）
 *
 * @param {Function} callback
 */
projectModel.getProjectNameList = function (callback) {
  projectModel.find({}, {projectName: 1, _id: 0}, {}, function (err, docs) {
    if (err) {
      console.log(err);
    }
    callback && callback(docs);
  });
};

/**
 * 返回项目列表（包含所有字段）
 *
 * @param {Function } callback
 */
projectModel.getProjectList = function (callback) {
  projectModel.find({isShow: true}, {}, {},function (err, docs) {
    if (err) {
      console.log(err);
    }
    callback && callback(docs);
  });
};

/**
 * 创建项目文件夹
 *
 * @param {Object} obj
 * @param {Function} callback
 */
projectModel.createProjectFiles = function (obj, callback) {
  if (obj) {
    var dirPath = baseUrl + obj.projectName;
    //TODO
    fs.mkdir(dirPath, function (err) {
      if (err) {
        console.log(err);
      }
      fs.writeFileSync(path.join(dirPath, 'gulpfile.js'), obj.gulpfile);
      fs.writeFileSync(path.join(dirPath, 'cssConfig.json'), obj.cssConfig);
      fs.writeFileSync(path.join(dirPath, 'requireConfig.js'), obj.requireConfig);
      fs.writeFileSync(path.join(dirPath, 'run.bat'), obj.run);
      fs.writeFileSync(path.join(dirPath, 'srcConfig.json'), obj.srcConfig);
      callback && callback();
    });
  }
};

/**
 * 读取项目文件
 *
 * @param {Object} projectName
 * @param {Function} callback
 */
projectModel.getProjectFiles = function (projectName, callback) {
  var obj = {};
  var dirPath = baseUrl + projectName;
  //TODO
  obj.gulpfile = fs.readFileSync(path.join(dirPath, 'gulpfile.js'));
  obj.cssConfig = fs.readFileSync(path.join(dirPath, 'cssConfig.json'));
  obj.requireConfig = fs.readFileSync(path.join(dirPath, 'requireConfig.js'));
  obj.run = fs.readFileSync(path.join(dirPath, 'run.bat'));
  obj.srcConfig = fs.readFileSync(path.join(dirPath, 'srcConfig.json'));

  callback && callback(obj);
};

/**
 * 移除项目文件夹
 *
 * @param {String} projectName
 * @param {Function} callback
 */
projectModel.removeProjectFiles = function (projectName, callback) {
  if (projectName) {
    var dirPath = baseUrl + projectName;
    //TODO
    fs.unlinkSync(path.join(dirPath, 'gulpfile.js'));
    fs.unlinkSync(path.join(dirPath, 'cssConfig.json'));
    fs.unlinkSync(path.join(dirPath, 'requireConfig.js'));
    fs.unlinkSync(path.join(dirPath, 'run.bat'));
    fs.unlinkSync(path.join(dirPath, 'srcConfig.json'));
    fs.rmdir(dirPath, function (err) {
      if (err) {
        console.log(err);
      }
      callback && callback();
    });
  }
};

/**
 * 创建项目
 *
 * @param req
 * @param res
 */
projectModel.createProject = function (req, res) {
  var obj = req.body;
  var doc = {
    projectName: obj.projectName,
    createTime: moment().format('YYYY-MM-DD HH:mm:ss'),
    createBy: req.session.user.username,
    lastOptimizeTime: '暂无数据',
    lastOptimizeBy: '暂无数据',
    isShow: true
  };
  projectModel.create(doc, function (err, doc) {
    if (err) {
      console.log(err);
    }
    projectModel.createProjectFiles(obj, sendMsg);

    function sendMsg() {
      res.send({
        status: 200,
        message: 'ok'
      });
    }
  });
};

/**
 * 项目管理
 *
 * @param req
 * @param res
 */
projectModel.manageProject = function (req, res) {
  var obj = req.body;
  var type = obj.type;
  var reg = new RegExp(obj.search, 'g');

  switch (type) {
    case 'some':
      if (obj.search === '%delete%') {
        projectModel.find({isShow: false}, {_id: 0}, {}, function (err, docs) {
          if (err) {
            console.log(err);
          }
          userModel.count({username: req.session.user.username, role: 1}, function (err, count) {
            if (err) {
              console.log(err);
            }
            if (count) {
              res.send({
                status: 200,
                projectList: docs,
                isShowDeleted: true
              });
            } else {
              res.send({
                status: 200,
                projectList: [],
                isShowDeleted: false
              });
            }
          });
        });
      } else {
        projectModel.find({'projectName': reg, isShow: true}, {_id: 0}, {}, function (err, docs) {
          if (err) {
            console.log(err);
          }
          res.send({
            status: 200,
            projectList: docs,
            isShowDeleted: false
          });
        });
      }
      break;
    case 'all':
      projectModel.find({isShow: true}, {_id: 0}, {}, function (err, docs) {
        if (err) {
          console.log(err);
        }
        res.send({
          status: 200,
          projectList: docs,
          isShowDeleted: false
        });
      });
      break;
    case 'delete':
      projectModel.update({projectName: obj.projectName}, {$set: {isShow: false}}, {}, function (err, docs) {
        if (err) {
          console.log(err);
        }
        res.send({
          status: 200
        });
      });
      break;
    case 'depDelete':
      projectModel.remove({projectName: obj.projectName}, function (err) {
        if (err) {
          console.log(err);
        }
        //TODO
        projectModel.removeProjectFiles(obj.projectName, sendMessage);

        function sendMessage() {
          res.send({
            status: 200
          });
        }
      });
      break;
    case 'recovery':
      projectModel.update({projectName: obj.projectName}, {$set: {isShow: true}}, {}, function (err, docs) {
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
 * 修改项目配置
 *
 * @param req
 * @param res
 */
projectModel.editProject = function (req, res) {
  var obj = req.body;

  projectModel.createProjectFiles(obj, sendMsg);

  function sendMsg() {
    res.send({
      status: 200,
      message: 'ok'
    });
  }
};

module.exports = projectModel;


