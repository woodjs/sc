var mongoose = require('mongoose');
var projectSchema = new mongoose.Schema({
  projectName: {
    type: 'String',
    required: true,
    unique: true
  },
  createTime: {
    type: 'String',
    required: true
  },
  createBy: {
    type: 'String',
    required: true
  },
  lastOptimizeTime: {
    type: 'String'
  },
  lastOptimizeBy: {
    type: 'String'
  },
  isOptimizing: {
    type: 'Boolean',
    default: false
  },
  isShow: {
    type: 'Boolean',
    default: true
  }
});

module.exports = projectSchema;