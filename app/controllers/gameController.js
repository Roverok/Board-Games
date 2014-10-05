
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

exports.fetchGameList = function(req,res){
  var success = function(games){
    res.json(games);
  }
  var failure = function(){
    res.status(500).json({status: 'failure'});
  }
  gameService.fetchGameList(success,failure);
};


exports.addGameToList = function(req,res){
  var options = {};
  var body = req.body;
  if(typeof body !== 'undefined')
    options = body;
  var failure = function(){
    res.status(500).json({status: 'failure'});
  }
  var addSuccess = function(result){
    res.json(result);
  }
  var searchSuccess = function(games){
    if(games.length == 0){
      gameService.addNewGame(addSuccess, failure, options);
    }else{
      res.json({status:1,errMsg:'This name has already been taken'});
    }
  }

  gameService.fetchGameList(searchSuccess,failure,options);
};

exports.updatePlayerMatch = function(req,res){
  var players = decodeURIComponent(req.query.players).split(',');
  var success = function(result){
    res.json(result)
  }
  var failure = function(){
    res.status(500).json({status: 'failure'});
  }
  for(var i in players){
    var playerID = players[i];
    gameService.updatePlayerMatch({'id':playerID}, success, failure);
  }
};

exports.updatePlayerWin = function(req,res){
  var playerID = req.query.player;
  var success = function(result){
    res.json(result)
  }
  var failure = function(){
    res.status(500).json({status: 'failure'});
  }
  gameService.updatePlayerWin({'id':playerID}, success, failure);
};
