
/**
 * Module dependencies.
 */

var express = require('express');
/*
var routes = require('./routes');
var user = require('./routes/user');
*/
var path = require('path');

/*
var mongoose = require('mongoose');
var db = mongoose.connection;
var conn = mongoose.connect('mongodb://localhost/testdb');
db.on('error', console.error);
db.once('open', function() {
  // Create your schemas and models here.
  var playaSchema = new mongoose.Schema({
    firstName: String,
    lastName: String
  });
  var collection = db.collection("playa");
  var Playa = conn.model('Playa', playaSchema);
  Playa.save({firstName: 'a', lastName: 'b'}, function(errr, data){
    console.log(errr); console.log(data);
  });
});
*/

var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

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

io.on('connection', function(socket){
    console.log("UserConnected");
    socket.on('disconnect', function(){
        console.log("DisCnctd");
    });
    socket.on('User select', function(msg){
        io.emit('User select', msg);
    });
    socket.on('Dice points', function(msg){
        io.emit('Dice points', msg);
    });

});


http.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
