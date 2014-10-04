var mongoose = require('mongoose');
//mongoose.connect('mongodb://localhost/board-games');
mongoose.connect('mongodb://boardadmin:711board117@ds043200.mongolab.com:43200/board-game');
module.exports = mongoose.connection;

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
