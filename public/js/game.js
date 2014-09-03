var snakes = [
  [31,32,27,13,5],
  [73,74,75,64,54,45,34,35,36,37,21],
  [85,86,72,68,50],
  [98,82,77,78,79,60,59,58,41,38]
];
var ladders = [
  [8,30],
  [15,44],
  [17,63],
  [47,65],
  [49,92],
  [62,80]
];
var position = {
  'p-1' : 0,
  'p-2' : 0
}

var gamePlay = {
  moveAvatar : function(player, from, to, speed, callback){
    var fromY = parseInt(from/10);
    var toY = parseInt(to/10);
    var fromX = from%10;
    var toX = to%10;
    var distY = toY - fromY;
    var distX;
    if(distY % 2 == 0){
      distX = toX - fromX;
    }else{
      distX = 9 - toX - fromX;
    }
    if(fromY%2 == 1)
      distX = -distX;
    distY = (distY <0?'-':'+')+ '=' + (55*(distY > 0 ? distY : -distY)) + 'px';
    distX = (distX <0?'-':'+')+ '=' + (57*(distX > 0 ? distX : -distX)) + 'px';
    $('.game-board .game-player.p-'+player).animate({bottom: distY , left: distX},speed,(typeof callback != undefined)?callback:null);
  },
  snakeBite : function(player,snakeBody){
    $('.game-player.p-'+player+' .player-avatar').removeClass('normal').addClass('sad');
    $('.game-player:not(.p-'+player+') .player-avatar').removeClass('normal').addClass('happy');
    var callback = function(){
      $('.game-player.p-'+player+' .player-avatar').addClass('normal').removeClass('sad');
      $('.game-player:not(.p-'+player+') .player-avatar').addClass('normal').removeClass('happy');
    }
    var length = snakeBody.length-1;
    for(var i=1;i<=length;i++)
      gamePlay.moveAvatar(player,snakeBody[i-1],snakeBody[i],300,(i==length)?callback:null);
    position['p-'+player] = snakeBody[length];
  },
  ladderHit : function(player,ladder){
    $('.game-player.p-'+player+' .player-avatar').removeClass('normal').addClass('happy');
    $('.game-player:not(.p-'+player+') .player-avatar').removeClass('normal').addClass('angry');
    var callback = function(){
      $('.game-player.p-'+player+' .player-avatar').addClass('normal').removeClass('happy');
      $('.game-player:not(.p-'+player+') .player-avatar').addClass('normal').removeClass('angry');
    }
    gamePlay.moveAvatar(player,ladder[0],ladder[1],500,callback);
    position['p-'+player] = ladder[1];
  },
  diceMove : function(player,dice){
    var source = position['p-'+player];
    var sourceX = parseInt(source%10);
    var delay = 0;
    if(source + dice <= 99){
      var dest = (sourceX+dice <= 9)? (source+dice) : (source+(9-sourceX));
      gamePlay.moveAvatar(player,source,dest,500);
      delay += 500;
      if(source + dice > dest){
        gamePlay.moveAvatar(player,dest,dest+1,500);
        delay += 500;
        dest += 1;
        if(source + dice > dest){
          gamePlay.moveAvatar(player,dest,source+dice,500);
          delay += 500;
        }
      }
      position['p-'+player] = source + dice;
      setTimeout(function(){
        gamePlay.checkLadderHit(player);
        gamePlay.checkSnakeBite(player);
      },delay);

    }  
  },
  checkLadderHit : function(player){
    for(var i in ladders){
      if(ladders[i][0] == position['p-'+player]){
        gamePlay.ladderHit(player,ladders[i]);
        return;
      }
    }
    return;
  },
  checkSnakeBite : function(player){
    for(var i in snakes){
      if(snakes[i][0] == position['p-'+player]){
        gamePlay.snakeBite(player,snakes[i]);
        return;
      }
    }
    return;
  },
  generateMeme  : function(winner,loser){
    $('.winner').addClass('p-'+winner);
    $('.winner .player-avatar').addClass('happy');
    $('.loser').addClass('p-'+loser);
    $('.loser .player-avatar').addClass('happy');
    $('#memeModal').addClass('image-result-1').modal('show');
  },
  initSnakeLadderGame : function(){
    $('.js-rollDice').click(function(){
      var player = $(this).attr('player');
      var dice = Math.floor((Math.random() * 6) + 1);
      $('.message').html(dice);
      gamePlay.diceMove(player,dice);
      $('.js-rollDice').attr('player',(dice == 6)?player:(player == 1)?2:1);
      if(position['p-'+player] == 99){
        gamePlay.generateMeme(player,(player == 1)?2:1);
      }
    });
    $('body').click(function(){
      $('#memeModal').modal('hide');
    });
  }
};