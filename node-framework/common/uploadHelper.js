var formidable = require('formidable');

function uploadHelper(req, opts, callback) {
  var form = new formidable.IncomingForm(opts || {
      keepExtensions: true,
      uploadDir: 'upload'
    });

  form.parse(req, function (err, fields, files) {
    if (!err) {
      callback(true, fields, files);
    } else {
      callback(false);
      err.publish();
    }
  });
}

module.exports = uploadHelper;