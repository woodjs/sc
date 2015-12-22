var mongoose = require('mongoose');
var db = mongoose.createConnection('mongodb://dbfeo:dbfeo@127.0.0.1:27017/feo');

db.on('open', function (err) {
  if (err) {
    console.log(err);
  }
  console.log('mongoose has connected to feo!');
});

db.on('error', function (err) {
  if (err) {
    console.log(err);
  }
});

module.exports = db;
