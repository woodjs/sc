var mongoose = require('mongoose');
var userSchema = new mongoose.Schema({
    username: {
        type: 'String'
    },
    password: {
        type: 'String'
    },
    nickname: {
        type: 'String'
    },
    role: {
        type: 'Number'
    },
    createTime: {
        type: 'Date'
    },
    createBy: {
        type: 'String'
    }
});

module.exports = userSchema;