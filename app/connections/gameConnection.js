var adminSchema = require('../schemas/adminSchema');

exports.fetchGamePlayers = function(query, projection, successCallback, errCallback){
  var result = {};
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