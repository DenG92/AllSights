const express = require('express');
const path = require('path');
const MongoClient = require('mongodb').MongoClient;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(express.static(path.join(__dirname, 'all-sights/dist/all-sights')));
app.use(express.static(path.join(__dirname, 'public'))); // test apis
const mongoClient = new MongoClient('mongodb://localhost:27017/', {useNewUrlParser: true, useUnifiedTopology: true});
let dbClient;

mongoClient
    .connect()
    .then(function (client) {
        dbClient = client;
        app.locals.database = client.db('allsightsdb');
        app.listen(3000, function () {
            console.log('Server is waiting for a connection...');
        });
    })
    .catch(function (err) {
        console.log(err);
    });

require('./routes/index')(app);

/*
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

const createError = require('http-errors');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

app.use(logger('dev'));
app.use(cookieParser());

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
*/

process.on('SIGINT', () => {
    dbClient.close();
    process.exit();
});

module.exports = app;
