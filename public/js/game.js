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
  'p-2' : 0,
  'p-3' : 0,
  'p-4' : 0
}
var randomNumber = 1;
var competitors = [];
var characters = {
  'p-1' : {
            'name' : 'AshBee',
            'position' : 0,
            'selected'  : false
          },
  'p-2' : {
            'name' : 'Ashish',
            'position' : 0,
            'selected'  : false
          },
  'p-3' : {
            'name' : 'Troll Kid',
            'position' : 0,
            'selected'  : false
          },
  'p-4' : {
            'name' : 'Trollmaster',
            'position' : 0,
            'selected'  : false
          }
};


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
    $('.game-board .game-player[type='+player+']').animate({bottom: distY , left: distX},speed,(typeof callback != undefined)?callback:null);
  },
  snakeBite : function(player,snakeBody){
    $('.game-player[type='+player+'] .player-avatar').removeClass('normal').addClass('sad');
    $('.game-player:not([type='+player+']) .player-avatar').removeClass('normal').addClass('happy');
    var callback = function(){
      $('.game-player[type='+player+'] .player-avatar').addClass('normal').removeClass('sad');
      $('.game-player:not([type='+player+']) .player-avatar').addClass('normal').removeClass('happy');
    }
    var length = snakeBody.length-1;
    for(var i=1;i<=length;i++)
      gamePlay.moveAvatar(player,snakeBody[i-1],snakeBody[i],300,(i==length)?callback:null);
    characters[player].position = snakeBody[length];
  },
  ladderHit : function(player,ladder){
    $('.game-player[type='+player+'] .player-avatar').removeClass('normal').addClass('happy');
    $('.game-player:not([type='+player+']) .player-avatar').removeClass('normal').addClass('angry');
    var callback = function(){
      $('.game-player[type='+player+'] .player-avatar').addClass('normal').removeClass('happy');
      $('.game-player:not([type='+player+']) .player-avatar').addClass('normal').removeClass('angry');
    }
    gamePlay.moveAvatar(player,ladder[0],ladder[1],500,callback);
    characters[player].position = ladder[1];
  },
  diceMove : function(player,dice){
    var source = characters[player].position;
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
      characters[player].position = source + dice;
      setTimeout(function(){
        gamePlay.checkLadderHit(player);
        gamePlay.checkSnakeBite(player);
      },delay);

    }  
  },
  checkLadderHit : function(player){
    for(var i in ladders){
      if(ladders[i][0] == characters[player].position){
        gamePlay.ladderHit(player,ladders[i]);
        return;
      }
    }
    return;
  },
  checkSnakeBite : function(player){
    for(var i in snakes){
      if(snakes[i][0] == characters[player].position){
        gamePlay.snakeBite(player,snakes[i]);
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
  generateMeme  : function(winner,loser,imageCase,number){
    $('#memeModal').attr('type','').modal('hide');
    $('.winner').attr('type',winner);
    $('.winner .player-avatar').addClass('happy');
    $('.loser').attr('type',loser);
    $('.loser .player-avatar').addClass(imageCase=='image-battle'?'happy':'sad');
    $('#memeModal').attr('type',imageCase+'-'+number).modal('show');
  },
  initGameBox : function(){
    $.each(characters, function(i,obj){
       if(obj.selected){
         var gameBoard = '<div class="game-player" type="' + i + '">' +
                            '<div class="player-avatar normal"></div>' +
                         '</div>';
         var miniScoreBoard = '<div class="mini-score-board" type="' + i + '">' + obj.name + gameBoard + '</div>';
         var scoreBoard = '<div class="score-box">' +
                            '<div class="score-board" type="' + i + '">' + obj.name + gameBoard +'</div>' +
                          '</div>';
         $('.game-board').append(gameBoard);
         $('.mini-score-box').append(miniScoreBoard);
         $('.box.half-box:last-child').append(scoreBoard);
         if($('.js-rollDice').attr('player') === undefined){
           $('.js-rollDice').attr('player',i);
         }
       }
    });
    gamePlay.findCompetitors();
    gamePlay.generateMeme(competitors[0],competitors[1],'image-battle',randomNumber);
    setTimeout(function(){
      $('#memeModal').modal('hide');
    },5000);
  },
  findNextOpponent : function(currentPlayer){
    var nextPlayer;
    $.each(characters,function(i,obj){
       if(i !== currentPlayer && obj.selected === true){
         nextPlayer = i;
       }
    });
    return nextPlayer;
  },
  findCompetitors : function(){
    $.each(characters,function(i,obj){
      if(obj.selected == true){
        console.log(i);
        competitors.push(i);
      }
    });
  },
  initSnakeLadderGame : function(){
    randomNumber = 2;
    $('.js-rollDice').click(function(){
      var player = $(this).attr('player');
      var dice = Math.floor((Math.random() * 6) + 1);
      $('.message').html(dice);
      gamePlay.diceMove(player,dice);
      var player2 = gamePlay.findNextOpponent(player);
      console.log(player2);
      $('.js-rollDice').attr('player',(dice == 6)?player:player2);
      if(characters[player].position == 99){
        gamePlay.generateMeme(player,player2,'image-result',randomNumber);
        /*setTimeout(function(){
          gamePlay.generateMeme(player,player2,'image-winner',randomNumber);
        },5000);
        setTimeout(function(){
          gamePlay.generateMeme(player,player2,'image-loser',randomNumber);
        },5000);*/
      }
    });
    $('.select-box').click(function(){
      var player = $(this).attr('type');
      if(!$(this).hasClass('selected')){
        if($('.select-box.selected').length < 2){
          $(this).addClass('selected');
          $(this).find('.player-name').addClass('text-color-p'+player);
          characters['p-'+player].selected = true;
        }
      }else{
        $(this).removeClass('selected');
        $(this).find('.player-name').removeClass('text-color-p'+player);
        characters['p-'+player].selected = false;
      }
      if($('.select-box.selected').length == 2){
        $('.continue-button').removeClass('hide');
      }else{
        $('.continue-button').addClass('hide');
      }
    });
    $('.game-title').on('click','.continue-button',function(){
      $('.game-title').fadeOut();
      setTimeout(function(){
        $('.game-select').fadeIn();
      },500);

    });
    $('.game-select').on('click','.continue-button',function(){
      $('.game-select').fadeOut();
      setTimeout(function(){
        gamePlay.initGameBox();
        $('.game-box').fadeIn();
      },500);
    });
  }
};