
/*
 * GET users listing.
 */

var adminSchema = require('../schemas/adminSchema'),
    gameService = require('../services/gameService')
    cheatCodes = require('../dataSamples/codeDataSample');

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
  var options = {'isOccupied':false};
  var success = function(games){
    res.json(games);
  }
  var failure = function(){
    res.status(500).json({status: 'failure'});
  }
  gameService.fetchGameList(success,failure,options);
};


exports.addGameToList = function(req,res){
  var options = {'isOccupied':false};
  var body = req.body;
  if(typeof body !== 'undefined'){
    for(var prop in body){
      options[prop] = body[prop];
    }
  }
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
  console.log(options);
  gameService.fetchGameList(searchSuccess,failure,options);
};

exports.updateGameOccupied = function(req,res){
  var gameID = req.query.gameID;
  var success = function(result){
    res.json(result)
  }
  var failure = function(){
    res.status(500).json({status: 'failure'});
  }
  gameService.updateGame({'_id':gameID}, {'isOccupied':true}, success, failure)
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

exports.joinGame = function(req,res){
  var options = {'isOccupied' : false};
  var body = req.body;
  if(typeof body !== 'undefined'){
    for(var prop in body){
      options[prop] = body[prop];
    }
  }
  var failure = function(){
    res.status(500).json({status: 'failure'});
  }
  var addSuccess = function(result){
    res.json(result);
  }
  var searchSuccess = function(games){
    if(games.length == 0){
      res.json({status:1,errMsg:'This game has been occupied'});
    }else{
      console.log(games);
      var setOptions = {};
      if(games[0].playerCount == 3)
        setOptions['isOccupied'] = true;
      console.log(setOptions);
      gameService.updateGame(options, setOptions, addSuccess, failure);
    }
  }
  console.log(options);
  gameService.fetchGameList(searchSuccess,failure,options);
};


exports.checkCheatCode = function(req,res){
  var charCode = req.body.charCode;
  var posn = Number(req.body.posn);
  if(cheatCodes.unlockPlayersCheat.charCodeAt(posn)-32 == charCode){
    posn += 1;
    if(posn === cheatCodes.unlockPlayersCheat.length){
      posn = -1;
    }
  }else{
    posn = 0;
  }
  res.json({status:posn});

};