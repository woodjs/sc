var checkModel = {};

checkModel.check = function (req, res) {
  switch (req.body.type) {
    case 'session_expired':
        if (req.session.user) {
          res.send({
            status: 200,
            result: false
          });
        } else {
          res.send({
            status: 200,
            result: true
          });
        }
      break;
    default:
      console.log('check type is not defined!');
  }
};

module.exports = checkModel;