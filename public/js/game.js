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
var memeMessage = {};
var randomNumber = 1;
var competitors = [];
var yourPlayers = [];
var yourGameID = -1;
var players = {};
var posn = 0;
var count = 20;
var userReload = true;

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
    distY = (distY < 0 ? '-' : '+') + '=' + (54 * (distY > 0 ? distY : -distY)) + 'px';
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
  removePlayersFromGame: function(){
    $.each(yourPlayers, function(i,player){
      var success = function (data) {
        console.log(data);
      }
      var failure = function (data) {
        console.log(data)
      }
      gamePlay._sendAjaxRequest(urls.togglePlayerInGame, {gameID:yourGameID, playerID:player, type:'remove'}, "POST", true, success, failure, "JSON", "application/x-www-form-urlencoded; charset=UTF-8");
    });
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
        count = -1;
        if (players[player].isYours) {
          gamePlay.updatePlayerWin(player);
        }
        if(yourGameID !== -1){
          gamePlay.removePlayersFromGame();
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
          userReload = false;
          location.href = location.href
        }, playerCount*4000);
      } else {
        count = players[(dice == 6) ? player : player2].isYours ? 10 : -1;
        gamePlay.setGamePlayCountdown();
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
  generateMeme: function (playerList, imageCase) {
    $('.meme-image .game-player').remove();
    $.each(playerList,function(i,player){
      var playerIcon = '<div class="game-player p'+ (i+1) +'" type="'+ player+'">' +
                          '<div class="player-avatar" type="'+ ((imageCase == 'loser' || (imageCase == 'result' && i == 1)) ? 'sad' : 'happy') +'"></div>' +
                       '</div>';
      $('.meme-image').append(playerIcon);
    });
    var topGameMessage = '', bottomGameMessage = '';

    if (imageCase === 'battle') {
      topGameMessage = memeMessage[imageCase][playerList.length][0].top;
      bottomGameMessage = memeMessage[imageCase][playerList.length][0].bottom;
    } else {
      topGameMessage = memeMessage[imageCase][competitors.length >= 2 ? competitors.length : '2'][randomNumber - 1].top + ((imageCase !== 'result') ? players[playerList[0]].name : '');
      bottomGameMessage = memeMessage[imageCase][competitors.length >= 2 ? competitors.length : '2'][randomNumber - 1].bottom;
    }

    $('.game-message.top').html(topGameMessage);
    $('.game-message.bottom').html(bottomGameMessage);
    $('#memeModal').attr('type', 'image-' + (imageCase === 'battle' ? playerList.length : (competitors.length >= 2 ? competitors.length : '2')) + '-' + imageCase + '-' + randomNumber).modal('show');
//    $('#memeModal').attr('type', 'image-' + playerList.length + '-' + imageCase + '-' + randomNumber).modal('show');
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
        $('.game-score').append(scoreBoard);
        if ($('.js-rollDice').attr('player') === undefined) {
          $('.js-rollDice').attr('player', i);
          $('.player-message.text-color-' + i).removeClass('hide');
          count = players[i].isYours ? 10 : -1;
        }
      }
    });
    $('.game-box .score-box').css('height', 400 / competitors.length + 'px');
    gamePlay.updatePlayerPlay();
    gamePlay.generateMeme(competitors, 'battle');
    setTimeout(gamePlay.setGamePlayCountdown,3000);
  },
  findNextOpponent: function (currentPlayer) {
    for (var i = 0; i < competitors.length; i++) {
      if (competitors[i] === currentPlayer) {
        var j = (i + 1) % competitors.length;
        return competitors[j];
      }
    }
    return competitors[0];
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
  fetchGamePlayers: function () {
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
  fetchMemeMessages: function () {
    var success = function (data) {
      $.each(data, function (index, obj) {
        memeMessage[obj.type] = obj.playerCount;
      });
    }
    var failure = function (data) {
      console.log(data)
    }
    gamePlay._sendAjaxRequest(urls.fetchMemeMessageList, "", "GET", false, success, failure, "JSON", "application/x-www-form-urlencoded; charset=UTF-8");
  },
  selectAvatar: function (player, selection, isYours) {
    var playerEle = $('.select-box[type=' + player + ']');
    count = 20;
    if (selection) {
      if ($('.select-box.selected').length < 4) {
        playerEle.addClass('selected');
        playerEle.find('.player-name').addClass('text-color-' + player);
        playerEle.find('.player-who').html(isYours ? '(You)' : '(Rival)');
        players[player].selected = true;
        if (isYours)
          players[player].isYours = true;
      }
    } else {
      if (players[player].isYours || !isYours) {
        playerEle.removeClass('selected');
        playerEle.find('.player-name').removeClass('text-color-' + player);
        playerEle.find('.player-who').html('');
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
  selectDefaultGamePlayer : function(){
    $.each(players,function(id,player){
      if(! player.selected){
        $('.select-box[type='+ id +']').trigger('click');
        return false;
      }
    });
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
        gamePlay.selectDefaultGamePlayer();
      }
      var failure = function(data){
        console.log(data);
      }
      gamePlay._sendAjaxRequest(urls.fetchPlayersInGame, {gameID:yourGameID}, "GET", true, success, failure, "JSON", "application/x-www-form-urlencoded; charset=UTF-8");
    }
  },
  initSnakeLadderGame: function () {
    var socket = io();
    gamePlay.fetchGamePlayers();
    gamePlay.fetchMemeMessages();
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
        count = -1;
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
        var playerCount = $('.select-box.selected').length;
        gamePlay._sendAjaxRequest(urls.togglePlayerInGame, {gameID:yourGameID, playerID:player, type:selection?'add':'remove', playerCount:playerCount}, "POST", true, success, failure, "JSON", "application/x-www-form-urlencoded; charset=UTF-8");
      }
      gamePlay.selectAvatar(player, selection, true);
      if (yourGameID !== -1){
        socket.emit('selection', {player: player, selection: players[player].selected, gameID: yourGameID});
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
              socket.emit('selectCountdown', {gameID: yourGameID});
            }
          }
        }
        var failure = function (data) {
          console.log(data)
        }
        gamePlay._sendAjaxRequest(urls.checkCheatCode, {'charCode': e.which, 'posn': posn}, "POST", false, success, failure, "JSON", "application/x-www-form-urlencoded; charset=UTF-8");
      }
    });
    $(window).bind("beforeunload",function(e){
      e.preventDefault;
      console.log('Holla Holla');
      if(userReload && yourGameID !== -1 && $('.game-select, .game-box').is(':visible')){
        var playerCount = $('.select-box.selected').length;
        $.each(players,function(playerID,player){
          console.log(player.selected);
          if(player.selected && player.isYours){
            var success = function(){
              console.log('socket->'+playerID+' using '+ $('.game-select').is(':visible')?'removeSelectedRival':'removePlayRival');
              socket.emit($('.game-select').is(':visible')?'removeSelectedRival':'removePlayRival',{gameID:yourGameID, playerID:playerID});
              playerCount -= 1;
            }
            var failure = function(data){
              console.log(data);
            }
            console.log('delete->'+playerID);
            gamePlay._sendAjaxRequest(urls.togglePlayerInGame, {gameID:yourGameID, playerID:playerID, type:'remove', playerCount:playerCount}, "POST", false, success, failure, "JSON", "application/x-www-form-urlencoded; charset=UTF-8");
          }
        });
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
        if(data.status == 0){
          $('.game-mode').fadeOut();
          setTimeout(function () {
            $('.game-select .continue-button').hide();
            $('.time-count').show();
            $('.game-select').fadeIn();
          }, 500);
          yourGameID = gameID;
          gamePlay.setSelectionCountdown($('.time-count'));
          gamePlay.fetchPlayersInGame({'gameID':gameID});
          socket.emit('selectCountdown', {gameID: yourGameID});
        } else {
         console.log(data);
        }
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
    socket.on('selectCountdown', function (data) {
      if (data.gameID == yourGameID) {
        count = 20;
      }
    });
    socket.on('removeSelectedRival', function (data) {
      console.log(data);
      if (data.gameID == yourGameID && $('.game-select').is(':visible') && players[data.playerID].selected && (!players[data.playerID].isYours)) {
        $('.select-box[type=' + data.playerID + ']').removeClass('selected');
        $('.select-box[type=' + data.playerID + ']').find('.player-name').removeClass('text-color-' + data.playerID);
        $('.select-box[type=' + data.playerID + ']').find('.player-who').html('');
        count = 20;
        players[data.playerID].selected = false;
      }
    });
    socket.on('removePlayRival', function (data) {
      console.log(data);
      if (data.gameID == yourGameID && $('.game-box').is(':visible') && players[data.playerID].selected && (!players[data.playerID].isYours)) {
        $.each(competitors,function(i, rival){
          if(rival === data.playerID){
            competitors.splice(i,1);
            $('.game-board .game-player[type='+rival+']').remove();
            $('.mini-score-board[type='+rival+']').remove();
            $('.score-board[type='+rival+']').parent().remove();
            count = 10;
            players[rival].selected = false;
            var newPlayer = gamePlay.findNextOpponent(rival);
            $('.player-message.text-color-' + newPlayer).fadeIn();
            $('.js-rollDice').attr('player',newPlayer);
            return false;
          }
        });
        if($('.score-box').length == 1){
          userReload = false;
          console.log(yourPlayers);
          if(yourGameID !== -1){
            gamePlay.updatePlayerWin(yourPlayers[0]);
            gamePlay.removePlayersFromGame();
          }
          setTimeout(function () {
            gamePlay.generateMeme(yourPlayers, 'winner');
          }, 2000);
          setTimeout(function () {
            location.href = location.href;
          }, 6000);
        }
      }
    });
  },
  setSelectionCountdown: function (element) {
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
              userReload = false;
              location.href = location.href;
            }, 2000);
          }
        };
        gamePlay.updateGameOccupied();
        gamePlay.findYours(callback);
      }
    })();
  },
  setGamePlayCountdown: function () {
    (function loop() {
      if (count > 0) {
        count -= 1;
        setTimeout(loop, 1000);
      } else if (count == 0){
        $('.js-rollDice').trigger('click');
      } else {
        return false;
      }
    })();
  }
};