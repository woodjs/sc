var db = require('../config/db');
var projectSchema = require('../schema/project');
var projectModel = db.model('projects', projectSchema, 'projects');

module.exports = projectModel;


