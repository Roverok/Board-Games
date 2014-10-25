var mongoose = require('mongoose');
//mongoose.connect('mongodb://localhost/board-games');
mongoose.connect('mongodb://boardadmin:711board117@ds043200.mongolab.com:43200/board-game');
module.exports = mongoose.connection;