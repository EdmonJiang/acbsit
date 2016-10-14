'use strict';
const express = require('express'),
    path = require('path'),
    mongoose = require('mongoose'),
    logger = require('morgan'),
    bodyParser = require('body-parser'),
    config = require('./config/config');

const app = express();

const server = app.listen(process.env.PORT||3000);
mongoose.Promise = require('bluebird');
mongoose.connect(config.uri);
var db = mongoose.connection;
db.on('open', function(){console.log('mongodb connected.')})

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(logger('dev')); 
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: false })); 
//routes
app.use('/cmdb',express.static(path.join(__dirname, 'public')));

app.use('/cmdb', function(req,res,next){
  app.locals.currentUrl = req.path;
  app.locals.loggedUser = req.headers['x-iisnode-auth_user'];
  next();
})
app.use('/cmdb', require('./routes/index'))
app.use('/cmdb/staff', require('./routes/staff'))

app.all('*', function (req, res) {
  var ip = req.headers['x-forwarded-for']
  var dir = __dirname
    res.send('Hello World! url: '+req.url+', your ip: '+ip+req.path);
});

server.on('error', onError);

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });

 

