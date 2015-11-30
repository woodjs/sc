var mongoose = require('mongoose');
var projectSchema = new mongoose.Schema({
    projectName: {
        type: 'String'
    },
    createTime: {
        type: 'Date'
    },
    createBy: {
        type: 'String'
    },
    lastEditTime: {
        type: 'Date'
    },
    lastEditBy: {
        type: 'String'
    },
    isShow: {
        type: 'Boolean'
    }
});

module.exports = projectSchema;