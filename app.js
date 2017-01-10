'use strict';
const express = require('express'),
    path = require('path'),
    favicon = require('serve-favicon'),
    mongoose = require('mongoose'),
    logger = require('morgan'),
    bodyParser = require('body-parser'),
    config = require('./config/config'),
    bluebird = require('bluebird');

const app = express();
app.use(favicon(__dirname + '/public/favicon.ico'));

const server = app.listen(process.env.PORT||3000);
mongoose.Promise = bluebird;
mongoose.connect(config.uri);
//const db = mongoose.connection;
//db.on('open', function(){console.log('mongodb connected.')})

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(logger('dev')); 
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: false })); 
//routes
app.use('/cmdb',express.static(path.join(__dirname, 'public'), {maxAge: 0}));

app.use('/cmdb', function(req,res,next){
  let url = req.path;
  app.locals.currentUrl = url.search(/.*\/$/)?url+"/":url;
  app.locals.loggedUser = req.headers['x-iisnode-auth_user'];
  next();
})
app.use('/cmdb/site', require('./routes/site'))
app.use('/cmdb/staff', require('./routes/staff'))
app.use('/cmdb/adinfo', require('./routes/adinfo'))
app.use('/cmdb/ipt', require('./routes/ipt'))
app.use('/cmdb/warranty', require('./routes/warranty'))
app.use('/cmdb/thinkpad', require('./routes/thinkpad'))
app.use('/cmdb/airwatch', require('./routes/airwatch'))
app.use('/cmdb/acbus', require('./routes/acbus'))

app.all('*', function (req, res) {
  var ip = req.headers['x-forwarded-for']
  //var dir = __dirname
  res.send('Hello '+ app.locals.loggedUser +', welcome to visit "'+req.url+'", but nothing here! <a href="/cmdb/site/">Back to HomePage</a><br />Your IP Address: '+ip);
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

 

