var mongoose = require('mongoose');
var userSchema = new mongoose.Schema({
  username: {
    type: 'String',
    required: true
  },
  password: {
    type: 'String',
    required: true,
    index: 0
  },
  nickname: {
    type: 'String',
    required: true
  },
  role: {
    type: 'Number',
    required: true
  },
  createTime: {
    type: 'String',
    required: true
  },
  createBy: {
    type: 'String',
    required: true
  }
});

module.exports = userSchema;