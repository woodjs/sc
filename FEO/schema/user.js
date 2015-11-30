var mongoose = require('mongoose');
var userSchema = new mongoose.Schema({
  username: {
    type: 'String',
    index: 1,
    required: true,
    unique: true
  },
  password: {
    type: 'String',
    required: true
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
    type: 'Date',
    required: true
  },
  createBy: {
    type: 'String',
    required: true
  }
});

module.exports = userSchema;