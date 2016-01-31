var mongoose = require('mongoose');
var errorSchema = new mongoose.Schema({
  name: {
    type: 'String',
    required: false
  },
  message: {
    type: 'String',
    required: false
  },
  stack: {
    type: 'String',
    required: false
  },
  createTime: {
    type: 'String',
    required: false
  }
});

module.exports = errorSchema;