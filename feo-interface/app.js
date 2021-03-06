var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressSession = require('express-session');
var MongoStore = require('connect-mongo')(expressSession);

var db = require('./config/db');
var login = require('./routes/login');
var logout = require('./routes/logout');
var check = require('./routes/check');
var help = require('./routes/help');
var optimize = require('./routes/optimize');
var user = require('./routes/user');
var project = require('./routes/project');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(expressSession({
  secret: 'sc_optimizer',
  name: 'sc_userId',
  rolling: true,
  cookie: {
    maxAge: 1000 * 3600 * 8
  },
  resave: false,
  saveUninitialized: true,
  store: new MongoStore({
    url: 'mongodb://dbfeo:dbfeo@127.0.0.1:27017/feo_sessions'
  })
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/optimize', optimize);
app.use('/login', login);
app.use('/logout', logout);
app.use('/check', check);
app.use('/help', help);
app.use('/user', user);
app.use('/project', project);
app.route('/').get(function (req, res) {
  res.redirect('/optimize');
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
