
/*
 * GET users listing.
 */

var adminSchema = require('../schemas/adminSchema'),
    gameService = require('../services/gameService');

exports.showSnakeAndLadders = function(req, res){
  adminSchema.playerSchema.find()
      .setOptions({sort:'id'})
      .exec(function(err, players){
        if(err){
          res.status(500).json({status: 'failure'});
        }else{
          res.render('home', {
            players: players
          });
        }
      });
};

exports.fetchGamePlayers = function(req,res){
  var success = function(players){
    res.json(players);
  }
  var failure = function(){
    res.status(500).json({status: 'failure'});
  }
  gameService.fetchGamePlayers(success,failure);
};