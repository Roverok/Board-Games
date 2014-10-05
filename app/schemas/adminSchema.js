var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var gameSchema = new Schema({
  name: String,
  playerCount: Number,
  isActive : Boolean,
  isOccupied : Boolean
});

var playerSchema = new Schema({
  name: String,
  id: String,
  position: Number,
  played: Number,
  won: Number,
  selected : Boolean,
  isYours : Boolean,
  isHidden:Boolean
});

var imageSchema = new Schema({
  fileName: String,
  id: String,
  fileType: String,
  url: String,
  securedUrl: String,
  width: Number,
  height: Number
});

var gamePlayerSchema = new Schema({
  id: String,
  gameID: String,
  playerID: String
});

module.exports = {
  'gameSchema' : mongoose.model('game', gameSchema),
  'imageSchema' : mongoose.model('image', imageSchema),
  'playerSchema' : mongoose.model('player', playerSchema),
  'gamePlayerSchema' : mongoose.model('gamePlayer', gamePlayerSchema)
};
