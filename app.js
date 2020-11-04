var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const debug = require('debug')('beta-house-backend:server');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const config = require('./config/config');
const passport = require('passport');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// CORS PROXY
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));


// PASSPORT INITIALISE
app.use(passport.initialize());


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

/**
 * HANDLING FORM DATA
 */
// app.use(upload.array());

/**
 * END OF HANDLING FORM DATA
 */

/*
  DATABASE SETUP
*/
const DB_URI = config.mongoDB.stringUrl;
mongoose.connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set('useCreateIndex', true);
global.connection = mongoose.connection;

global.connection.on('error', () => {
  debug("Database connection error");
});

global.connection.once('open', () => {
  debug("Database connection establised");
});

/*
  END OF DATABASE SETUP
*/


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
