var gameConnection = require('../connections/gameConnection');

exports.fetchGamePlayers = function (successCallback, failureCallback) {
  gameConnection.fetchGamePlayers({}, {"_id": 0, "__v": 0}, successCallback, failureCallback);
};

exports.fetchGameList = function (successCallback, failureCallback, queryOptions) {
  gameConnection.fetchGameList(queryOptions, {"__v": 0}, successCallback, failureCallback);
};

exports.updateGame = function (query, setOptions, successCallback, failureCallback) {
  gameConnection.updateGame(query, {'playerCount': 1}, setOptions, successCallback, failureCallback);
};

exports.addNewGame = function (successCallback, failureCallback, dataOptions) {
  gameConnection.addNewGame(successCallback, failureCallback, dataOptions);
};

exports.updatePlayerMatch = function (query, successCallback, failureCallback) {
  gameConnection.updatePlayer(query, {'played': 1}, successCallback, failureCallback);
};

exports.updatePlayerWin = function (query, successCallback, failureCallback) {
  gameConnection.updatePlayer(query, {'won': 1}, successCallback, failureCallback);
};
