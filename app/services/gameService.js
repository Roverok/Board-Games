var gameConnection = require('../connections/gameConnection');

exports.fetchGamePlayers = function(successCallback, failureCallback){
  gameConnection.fetchGamePlayers({},{"_id":0, "__v":0},successCallback, failureCallback);
};