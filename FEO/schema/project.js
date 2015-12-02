var mongoose = require('mongoose');
var projectSchema = new mongoose.Schema({
  projectName: {
    type: 'String',
    required: true
  },
  createTime: {
    type: 'String',
    required: true
  },
  createBy: {
    type: 'String',
    required: true
  },
  lastEditTime: {
    type: 'String',
    required: true
  },
  lastEditBy: {
    type: 'String',
    required: true
  },
  isShow: {
    type: 'Boolean',
    default: true
  }
});

module.exports = projectSchema;