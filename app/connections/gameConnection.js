var adminSchema = require('../schemas/adminSchema'),
    gameModel = require('../models/gameModel');

exports.fetchGamePlayers = function (query, projection, successCallback, errCallback) {
  adminSchema.playerSchema.find(query, projection)
      .setOptions({sort: 'id'})
      .exec(function (err, players) {
        if (err) {
          errCallback;
        } else {
          successCallback(players);
        }
      });
};

exports.fetchGameList = function (query, projection, successCallback, errCallback) {
  adminSchema.gameSchema.find(query, projection).sort({'dateCreated': -1})
      .exec(function (err, gameList) {
        if (err) {
          errCallback;
        } else {
          successCallback(gameList);
        }
      });
};

exports.addNewGame = function (successCallback, errCallback, gameData) {
  var record = new adminSchema.gameSchema(gameModel(gameData).getInformation());
  record.save(function (err) {
    if (err) {
      errCallback;
    }
  });
  successCallback({status: 0});
};

exports.updatePlayer = function (query, incParameter, successCallback, errCallback) {
  adminSchema.playerSchema.find(query)
      .update({$inc: incParameter}, function (err) {
        if (err) {
          errCallback;
        } else {
          successCallback({status: 0});
        }
      });
};

exports.updateGame = function (query, incParameter, setParameter, successCallback, errCallback) {
  adminSchema.gameSchema.find(query)
      .update({$inc: incParameter, $set: setParameter}, function (err) {
        if (err) {
          errCallback;
        } else {
          successCallback({status: 0});
        }
      });
};
