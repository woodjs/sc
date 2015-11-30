var express = require('express');
var router = express.Router();
var userModel = require('../model/user');

var user = {
    index: function(){
      

    },

    // @Url
    getUser:function(){


    }
};


/* GET users listing. */
router.use(function (err, req, res, next) {
  if (err) {
    console.log(err);
  }
  console.log('step into user control!');
  next();
});

router.route('/')
  .get(function (req, res) {
    res.send('respond with a resource');
  });

router.route('/addUser')
  .get(function (req, res) {
    res.render('add_user');
  })
  .post(function (req, res) {
    var obj = req.body;
    console.log(obj);
    userModel.create(obj, function (err, doc) {
      if (err) {
        console.log(err);
      }
      res.send(doc);
    });
  });

module.exports = router;
