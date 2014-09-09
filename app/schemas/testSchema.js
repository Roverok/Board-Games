var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var testSchema = new Schema({
  firstName: String,
  secondName: String
},{ collection : 'playa' });

module.exports = mongoose.model('playa', testSchema);