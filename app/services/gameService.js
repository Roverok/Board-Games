var gameConnection = require('../connections/gameConnection');

exports.fetchGamePlayers = function(successCallback, failureCallback){
  gameConnection.fetchGamePlayers({},{"_id":0, "__v":0},successCallback, failureCallback);
};

exports.fetchGameList = function(successCallback, failureCallback, queryOptions){
  gameConnection.fetchGameList(queryOptions,{"_id":0, "__v":0},successCallback, failureCallback);
};

exports.addNewGame = function(successCallback, failureCallback, dataOptions){
  gameConnection.addNewGame(successCallback, failureCallback, dataOptions);
};
