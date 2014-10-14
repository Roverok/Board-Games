var snakes = [
  [31, 32, 27, 13, 5],
  [73, 74, 75, 64, 54, 45, 34, 35, 36, 37, 21],
  [85, 86, 72, 68, 50],
  [98, 82, 77, 78, 79, 60, 59, 58, 41, 38]
];
var ladders = [
  [8, 30],
  [15, 44],
  [17, 63],
  [47, 65],
  [49, 92],
  [62, 80]
];
var memeMessage = {
  'battle': [
    {
      'top': ' Vs ',
      'bottom': 'Let the Battle Begin'
    }
  ],
  'winner': [
    {
      'top': 'My Client ',
      'bottom': 'Has Conquered Snakes N\' Ladders'
    },
    {
      'top': 'Congratulations ',
      'bottom': 'Hail To The King Of Snakes N\' Ladders'
    }
  ],
  'loser': [
    {
      'top': 'Hard Luck ',
      'bottom': 'Better Luck Next Time'
    },
    {
      'top': 'Hard Luck ',
      'bottom': 'Hey Maa!! Mata Ji!! You Lost'
    }
  ],
  'result': [
    {
      'top': 'Game Over',
      'bottom': 'Eat Sleep Dominate Repeat'
    },
    {
      'top': 'Game Over',
      'bottom': 'Flawless Victory'
    }
  ]
};
var randomNumber = 1;
var competitors = [];
var yourPlayers = [];
var yourGameID = -1;
var players = {};
var posn = 0;
var count = 20;

function displayAlertMessage(obj, alertMsg) {
  var element = $(obj)
  element.html(alertMsg).fadeIn();
  setTimeout(function () {
    element.fadeOut();
  }, 2000)
}

var gamePlay = {
  _sendAjaxRequest: function (rqUrl, rqData, methodType, async, success, failure, dataType, contentType) {
    $.ajax({
      url: rqUrl,
      type: methodType,
      data: rqData,
      dataType: dataType,
      contentType: contentType,
      cache: false,
      async: async,
      success: function (data) {
        success(data);
      },
      error: function (err) {
        failure(err);
      }
    });
  },
  moveAvatar: function (player, from, to, speed, callback) {
    var fromY = parseInt(from / 10);
    var toY = parseInt(to / 10);
    var fromX = from % 10;
    var toX = to % 10;
    var distY = toY - fromY;
    var distX;
    if (distY % 2 == 0) {
      distX = toX - fromX;
    } else {
      distX = 9 - toX - fromX;
    }
    if (fromY % 2 == 1)
      distX = -distX;
    distY = (distY < 0 ? '-' : '+') + '=' + (55 * (distY > 0 ? distY : -distY)) + 'px';
    distX = (distX < 0 ? '-' : '+') + '=' + (56 * (distX > 0 ? distX : -distX)) + 'px';
    $('.game-board .game-player[type=' + player + ']').animate({bottom: distY, left: distX}, speed, (typeof callback != undefined) ? callback : null);
  },
  snakeBite: function (player, snakeBody) {
    $('.game-player[type=' + player + '] .player-avatar').attr('type', 'sad');
    $('.game-player:not([type=' + player + ']) .player-avatar').attr('type', 'happy');
    var callback = function () {
      $('.game-player[type=' + player + '] .player-avatar').attr('type', 'normal');
      $('.game-player:not([type=' + player + ']) .player-avatar').attr('type', 'normal');
    }
    var length = snakeBody.length - 1;
    for (var i = 1; i <= length; i++)
      gamePlay.moveAvatar(player, snakeBody[i - 1], snakeBody[i], 800, (i == length) ? callback : null);
    players[player].position = snakeBody[length];
  },
  ladderHit: function (player, ladder) {
    $('.game-player[type=' + player + '] .player-avatar').attr('type', 'happy');
    $('.game-player:not([type=' + player + ']) .player-avatar').attr('type', 'angry');
    var callback = function () {
      $('.game-player[type=' + player + '] .player-avatar').attr('type', 'normal');
      $('.game-player:not([type=' + player + ']) .player-avatar').attr('type', 'normal');
    }
    gamePlay.moveAvatar(player, ladder[0], ladder[1], 800, callback);
    players[player].position = ladder[1];
  },
  diceMove: function (player, dice) {
    var player2 = gamePlay.findNextOpponent(player);
    var diceMsgElement = $('.dice-show .message');
    diceMsgElement.html('').removeClass().fadeOut();
    $('.dice-show').addClass('animate');
    $('.js-rollDice').attr('disabled', true);
    setTimeout(function () {
      diceMsgElement.addClass('message bkgrnd-' + player).html(dice).fadeIn();
      $('.dice-show').removeClass('animate');
      $('.js-rollDice').attr('player', (dice == 6) ? player : player2);
      gamePlay.diceMoveAvatar(player, dice);
      if (dice != 6) {
        $('.player-message.text-color-' + player).fadeOut();
        $('.player-message.text-color-' + player2).fadeIn();
      }
      $('.js-rollDice').attr('disabled', false);
      if (players[player].position == 99) {
        if (players[player].isYours) {
          gamePlay.updatePlayerWin(player);
        }
        gamePlay.generateMeme([player, player2], 'result');
        var playerCount = 0;
        setTimeout(function () {
          gamePlay.generateMeme([player], 'winner');
        }, 4000);
        playerCount = 1;
        $.each(competitors,function(i, rival){
          if(players[rival].isYours && players[rival].position != 99){
            playerCount += 1;
            setTimeout(function () {
              gamePlay.generateMeme([rival], 'loser');
              competitors.splice(i,1);
            }, playerCount*4000);
          }
        });
        playerCount += 1;
        setTimeout(function () {
          location.href = location.href
        }, playerCount*4000);
      }
    }, 2000);
  },
  diceMoveAvatar: function (player, dice) {
    var source = players[player].position;
    var sourceX = parseInt(source % 10);
    var delay = 0;
    if (source + dice <= 99) {
      var dest = (sourceX + dice <= 9) ? (source + dice) : (source + (9 - sourceX));
      gamePlay.moveAvatar(player, source, dest, 1000);
      delay += 500;
      if (source + dice > dest) {
        gamePlay.moveAvatar(player, dest, dest + 1, 500);
        delay += 500;
        dest += 1;
        if (source + dice > dest) {
          gamePlay.moveAvatar(player, dest, source + dice, 500);
          delay += 500;
        }
      }
      players[player].position = source + dice;
      setTimeout(function () {
        gamePlay.checkLadderHit(player);
        gamePlay.checkSnakeBite(player);
      }, delay);
    }
  },
  checkLadderHit: function (player) {
    for (var i in ladders) {
      if (ladders[i][0] == players[player].position) {
        gamePlay.ladderHit(player, ladders[i]);
        return;
      }
    }
    return;
  },
  checkSnakeBite: function (player) {
    for (var i in snakes) {
      if (snakes[i][0] == players[player].position) {
        gamePlay.snakeBite(player, snakes[i]);
        return;
      }
    }
    return;
  },
  /*animateAvatars  : function(){
   $(function(){
   $('#android-slide img:gt(0)').hide();
   setInterval(function(){
   $('#android-slide :first-child').fadeOut(500)
   .next('img').fadeIn(500)
   .end().appendTo('#android-slide');},
   5000);
   $('#ios-slide img:gt(0)').hide();
   setInterval(function(){
   $('#ios-slide :first-child').fadeOut(500)
   .next('img').fadeIn(500)
   .end().appendTo('#ios-slide');},
   5000);
   $('#windows-slide img:gt(0)').hide();
   setInterval(function(){
   $('#windows-slide :first-child').fadeOut(500)
   .next('img').fadeIn(500)
   .end().appendTo('#windows-slide');},
   5000);
   });
   },*/
  generateMeme: function (players, imageCase) {
    $('.meme-image .game-player').remove();
    $.each(players,function(i,player){
      var playerIcon = '<div class="game-player p'+ (i+1) +'" type="'+ player+'">' +
                          '<div class="player-avatar" type="'+ ((imageCase == 'loser' || (imageCase == 'result' && i == 1)) ? 'sad' : 'happy') +'"></div>' +
                       '</div>';
      $('.meme-image').append(playerIcon);
    });
    var gameMessage = '';

    if (imageCase === 'battle') {
      gameMessage = memeMessage[imageCase][0].bottom;
    } else if (imageCase === 'result') {
      gameMessage = memeMessage[imageCase][randomNumber - 1].bottom;
    } else {
      gameMessage = memeMessage[imageCase][randomNumber - 1].bottom;
    }

    $('.game-message').html(gameMessage);
    $('#memeModal').attr('type', 'image-' + (imageCase === 'battle' ? players.length : competitors.length) + '-' + imageCase + '-' + randomNumber).modal('show');
//    $('#memeModal').attr('type', 'image-' + players.length + '-' + imageCase + '-' + randomNumber).modal('show');
    setTimeout(function () {
      $('#memeModal').modal('hide');
    }, 3000);
  },
  updatePlayerPlay: function () {
    var playerIDs = yourPlayers.join(',');
    var success = function (data) {
      console.log(data);
    }
    var failure = function (data) {
      console.log(data)
    }
    gamePlay._sendAjaxRequest(urls.updatePlayerPlayed, {players: playerIDs}, "GET", false, success, failure, "JSON", "application/x-www-form-urlencoded; charset=UTF-8");
  },
  updateGameOccupied: function () {
    var success = function (data) {
      console.log(data);
    }
    var failure = function (data) {
      console.log(data)
    }
    gamePlay._sendAjaxRequest(urls.updateGame, {gameID: yourGameID}, "GET", false, success, failure, "JSON", "application/x-www-form-urlencoded; charset=UTF-8");
  },
  updatePlayerWin: function (player) {
    var success = function (data) {
      console.log(data);
    }
    var failure = function (data) {
      console.log(data)
    }
    gamePlay._sendAjaxRequest(urls.updatePlayerWon, {player: player}, "GET", true, success, failure, "JSON", "application/x-www-form-urlencoded; charset=UTF-8");
  },
  initGameBox: function () {
    randomNumber = Math.floor((Math.random() * 2) + 1);
    if (yourGameID === -1)
      gamePlay.findYours();
    gamePlay.findCompetitors();
    $.each(players, function (i, obj) {
      if (obj.selected) {
        var message = obj.isYours ? 'Your Turn' : 'Rival Turn';
        var gameBoard = '<div class="game-player" type="' + i + '">' +
            '<div class="player-avatar"></div>' +
            '</div>';
        var miniScoreBoard = '<div class="mini-score-board bkgrnd-' + i + '" type="' + i + '">' + obj.name + gameBoard + '<div class="player-message hide text-color-' + i + '">' + message + '</div></div>';
        var scoreBoard = '<div class="score-box">' +
            '<div class="score-board bkgrnd-' + i + '" type="' + i + '">' + obj.name + gameBoard + '<div class="player-message hide text-color-' + i + '">' + message + '</div></div>' +
            '</div>';
        $('.game-board').append(gameBoard);
        $('.mini-score-box').append(miniScoreBoard);
        $('.box.half-box:last-child').append(scoreBoard);
        if ($('.js-rollDice').attr('player') === undefined) {
          $('.js-rollDice').attr('player', i);
          $('.player-message.text-color-' + i).removeClass('hide');
        }
      }
    });
    $('.game-box .score-box').css('height', 400 / competitors.length + 'px');
    gamePlay.updatePlayerPlay();
    gamePlay.generateMeme(competitors, 'battle');
  },
  findNextOpponent: function (currentPlayer) {
    for (var i = 0; i < competitors.length; i++) {
      if (competitors[i] === currentPlayer) {
        var j = (i + 1) % competitors.length;
        return competitors[j];
      }
    }
  },
  findYours: function (callback) {
    $.each(players, function (i, obj) {
      if (obj.isYours) {
        yourPlayers.push(i);
      }
    });
    if (typeof callback !== 'undefined') {
      callback();
    }
  },
  findCompetitors: function () {
    $.each(players, function (i, obj) {
      if (obj.selected == true) {
        competitors.push(i);
      }
    });
  },
  initGamePlayers: function () {
    var success = function (data) {
      $.each(data, function (index, obj) {
        players[obj.id] = new Object();
        $.each(obj, function (key, value) {
          if (key !== 'id') {
            players[obj.id][key] = value;
          }
        });
      });
    }
    var failure = function (data) {
      console.log(data)
    }
    gamePlay._sendAjaxRequest(urls.fetchPlayerList, "", "GET", false, success, failure, "JSON", "application/x-www-form-urlencoded; charset=UTF-8");
  },
  selectAvatar: function (player, selection, isYours) {
    count = 20;
    if (selection) {
      if ($('.select-box.selected').length < 4) {
        $('.select-box[type=' + player + ']').addClass('selected');
        $('.select-box[type=' + player + ']').find('.player-name').addClass('text-color-' + player);
        $('.select-box[type=' + player + ']').find('.player-who').html(isYours ? '(You)' : '(Rival)');
        players[player].selected = true;
        if (isYours)
          players[player].isYours = true;
      }
    } else {
      if (players[player].isYours || !isYours) {
        $('.select-box[type=' + player + ']').removeClass('selected');
        $('.select-box[type=' + player + ']').find('.player-name').removeClass('text-color-' + player);
        $('.select-box[type=' + player + ']').find('.player-who').html('');
        players[player].selected = false;
        if (isYours)
          players[player].isYours = false;
      }
    }
    if ($('.select-box.selected').length >= 2) {
      $('.continue-button').removeClass('hide');
    } else {
      $('.continue-button').addClass('hide');
    }
  },
  searchGameList: function () {
    var success = function (data) {
      $('#gameList, #noGameList').removeClass('loading');
      if (data.length > 0) {
        $('#gameList tr.game-row').remove();
        $.each(data, function (index, obj) {
          var gameRow = "<tr class='game-row'>" +
                          "<td>" + obj.name + "</td>" +
                          "<td>" + obj.playerCount + "/4 playing</td>" +
                          "<td>" +
                            "<div class='continue-button'><div class='button js-joinGame' type='" + obj._id + "'>Join</div></div>" +
                          "</td>" +
                        "</tr>";
          $('#gameList').append(gameRow);
        });
        $('#noGameList').hide();
        $('#gameList').fadeIn();
      } else {
        $('#gameList').hide();
        $('#noGameList').fadeIn();
      }
    }
    var failure = function (data) {
      $('#gameList, #noGameList').removeClass('loading');
    }
    $('#gameList, #noGameList').addClass('loading');
    gamePlay._sendAjaxRequest(urls.fetchGameList, "", "GET", false, success, failure, "JSON", "application/x-www-form-urlencoded; charset=UTF-8");
  },
  fetchPlayersInGame : function(options){
    if(options.gameID === yourGameID){
      var success = function(data){
        $.each(data,function(i,obj){
          $('.select-box[type=' + obj.playerID + ']').addClass('selected');
          $('.select-box[type=' + obj.playerID + ']').find('.player-name').addClass('text-color-' + obj.playerID);
          $('.select-box[type=' + obj.playerID + ']').find('.player-who').html('(Rival)');
          players[obj.playerID].selected = true;
        });
      }
      var failure = function(data){
        console.log(data);
      }
      gamePlay._sendAjaxRequest(urls.fetchPlayersInGame, {gameID:yourGameID}, "GET", true, success, failure, "JSON", "application/x-www-form-urlencoded; charset=UTF-8");
    }
  },
  initSnakeLadderGame: function () {
    var socket = io();
    gamePlay.initGamePlayers();
    $('.js-submitGame').click(function () {
      var nameEle = $('[name=gameName]');
      var name = nameEle.val();
      if (name.length >= 3) {
        var success = function (data) {
          nameEle.removeClass('loading');
          if (data.status == 1) {
            displayAlertMessage('.alert-msg', data.errMsg)
          } else {
            nameEle.val('');
            displayAlertMessage('.alert-msg', msg.newGameAdded);
            gamePlay.searchGameList();
            socket.emit('newGame', {status: 0});
          }
        }
        var failure = function (data) {
          nameEle.removeClass('loading');
        }
        nameEle.addClass('loading');
        gamePlay._sendAjaxRequest(urls.addNewGame, {name: name}, "POST", true, success, failure, "JSON", "application/x-www-form-urlencoded; charset=UTF-8");
      } else {
        displayAlertMessage('.alert-msg', msg.enterGameName);
      }
    });
    $('.js-rollDice').click(function () {
      var player = $(this).attr('player');
      if ($(this).attr('disabled') !== 'disabled' && players[player].isYours) {
        var dice = Math.floor((Math.random() * 6) + 1);
        if (yourGameID !== -1)
          socket.emit('dice', {player: player, dice: dice, gameID: yourGameID});
        gamePlay.diceMove(player, dice);
      }
    });
    $('.select-box').click(function () {
      var player = $(this).attr('type');
      var selection = !$(this).hasClass('selected');
      if((yourGameID !== -1) && (selection || (!selection && players[player].isYours))){
        var success = function (data) {
          console.log(data);
        }
        var failure = function (data) {
          console.log(data)
        }
        gamePlay._sendAjaxRequest(urls.togglePlayerInGame, {gameID:yourGameID, playerID:player, type:selection?'add':'remove'}, "POST", true, success, failure, "JSON", "application/x-www-form-urlencoded; charset=UTF-8");
      }
      gamePlay.selectAvatar(player, selection, true);
      if (yourGameID !== -1){
        socket.emit('selection', {player: player, selection: players[player].selected, gameID: yourGameID});
        socket.emit('countdown', {gameID: yourGameID});
      }
    });
    $(document).keyup(function (e) {
      if ($('.game-select').is(':visible') && posn !== -1) {
        var success = function (data) {
          posn = data.status;
          if (posn === -1) {
            $('.select-box.hide').removeClass('hide');
            if (yourGameID !== -1){
              count = 20;
              socket.emit('unlockPlayers', {gameID: yourGameID});
              socket.emit('countdown', {gameID: yourGameID});
            }
          }
        }
        var failure = function (data) {
          console.log(data)
        }
        gamePlay._sendAjaxRequest(urls.checkCheatCode, {'charCode': e.which, 'posn': posn}, "POST", false, success, failure, "JSON", "application/x-www-form-urlencoded; charset=UTF-8");
      }
    });
    $('.game-title').on('click', '.js-gameEnter', function () {
      $(this).fadeOut();
      setTimeout(function () {
        $('.continue-button .boxes').fadeIn();
      }, 300);
    });
    $('.game-title').on('click', '.js-gamePlay', function () {
      var gamePlayType = $(this).attr('type');
      $('.game-title').fadeOut();
      setTimeout(function () {
        $((gamePlayType === 'local') ? '.game-select' : '.game-mode').fadeIn();
        if (gamePlayType === 'global') {
          gamePlay.searchGameList();
        }
      }, 500);
    });
    $('.game-mode').on('click', '.game-row .js-joinGame', function () {
      var gameID = $(this).attr('type');
      var success = function (data) {
        $('.game-mode').fadeOut();
        setTimeout(function () {
          $('.game-select .continue-button').hide();
          $('.time-count').show();
          $('.game-select').fadeIn();
        }, 500);
        yourGameID = gameID;
        gamePlay.setCountdown($('.time-count'));
        gamePlay.fetchPlayersInGame({'gameID':gameID});
        socket.emit('countdown', {gameID: yourGameID});
      }
      var failure = function (data) {
        console.log(data)
      }
      gamePlay._sendAjaxRequest(urls.joinGame, {_id: gameID}, "POST", false, success, failure, "JSON", "application/x-www-form-urlencoded; charset=UTF-8");

    });
    $('.game-select').on('click', '.continue-button', function () {
      $('.game-select').fadeOut();
      setTimeout(function () {
        gamePlay.initGameBox();
        $('.game-box').fadeIn();
      }, 500);
    });
    socket.on('selection', function (data) {
      if (players[data.player].selected != data.selection && data.gameID === yourGameID) {
        gamePlay.selectAvatar(data.player, data.selection, false);
      }
    });
    socket.on('dice', function (data) {
      if (players[data.player].selected && !players[data.player].isYours && data.gameID === yourGameID) {
        gamePlay.diceMove(data.player, data.dice);
      }
    });
    socket.on('unlockPlayers', function (data) {
      if (data.gameID === yourGameID) {
        $('.select-box.hide').removeClass('hide');
      }
    });
    socket.on('newGame', function (data) {
      if (data.status === 0 && $('.game-mode').is(':visible')) {
        gamePlay.searchGameList();
      }
    });
    socket.on('countdown', function (data) {
      if (data.gameID == yourGameID) {
        count = 20;
      }
    });
  },
  setCountdown: function (element) {
    (function loop() {
      element.html('Time Left : '+count + ' seconds');
      if (count--) {
        setTimeout(loop, 1000);
      } else {
        var callback = function () {
          if (yourPlayers.length > 0 && $('.select-box.selected').length > 1) {
            element.html('Launching the Game...');
            $('.game-select').fadeOut();
            setTimeout(function () {
              gamePlay.initGameBox();
              $('.game-box').fadeIn();
            }, 2000);
          } else {
            element.html('Cancelling the Game...');
            setTimeout(function () {
              location.href = location.href;
            }, 2000);
          }
        };
        gamePlay.updateGameOccupied();
        gamePlay.findYours(callback);
      }
    })();
  }
};