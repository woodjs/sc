var mongoose = require('mongoose');
var db = mongoose.createConnection('mongodb://10.0.0.106:27017/optimizer');

db.on('open', function (err) {
  if (err) {
    console.log(err);
  }
  console.log('mongoose has connected to optimizer!');
});

db.on('error', function (err) {
  if (err) {
    console.log(err);
  }
});

module.exports = db;
