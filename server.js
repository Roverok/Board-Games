
/**
 * Module dependencies.
 */

var express = require('express'),
    path = require('path'),
    cloudinary = require('cloudinary'),
    http = require('http'),
    io = require('socket.io')(http),
    db = require('./db'),
    app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

require('./routes')(app);

require('./app/connections/gameSocket')(io);

require('./app/connections/imageCloud')(cloudinary);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
