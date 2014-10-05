var adminSchema = require('../schemas/adminSchema'),
    gameModel = require('../models/gameModel');

exports.fetchGamePlayers = function(query, projection, successCallback, errCallback){
  adminSchema.playerSchema.find(query,projection)
      .setOptions({sort:'id'})
      .exec(function(err, players){
        if(err){
          errCallback;
        }else{
          successCallback(players);
        }
      });
};

exports.fetchGameList = function(query, projection, successCallback, errCallback){
  console.log('I was here',query);
  adminSchema.gameSchema.find(query,projection)
      .setOptions({sort:'_id'})
      .exec(function(err, gameList){
        console.log(gameList);
        if(err){
          console.log('Error');
          errCallback;
        }else{
          console.log('True');
          successCallback(gameList);
        }
      });
};

exports.addNewGame = function(successCallback, errCallback, gameData){
  var record = new adminSchema.gameSchema(gameModel(gameData).getInformation());
  record.save(function(err) {
    if (err) {
      errCallback;
    }
  });
  successCallback({status:0});
};