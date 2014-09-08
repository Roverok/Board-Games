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

var memeMessage = {
  'image-battle' : [
    {
      'top': ' Vs ',
      'bottom': 'Let the Battle Begin'
    }
  ],
  'image-winner' : [
    {
      'top': 'My Client ',
      'bottom': 'Has Conquered Snakes N\' Ladders'
    },
    {
      'top': 'Congratulations ',
      'bottom': 'Hail To The King Of Snakes N\' Ladders'
    }
  ],
  'image-loser' : [
    {
      'top': 'Hard Luck ',
      'bottom': 'Better Luck Next Time'
    },
    {
      'top': 'Hard Luck ',
      'bottom': 'Hey Maa!! Mata Ji!! You Lost'
    }
  ],

  'image-result' : [
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
var characters = {
  'p-1' : {
    'name' : 'AshBee',
    'position' : 0,
    'selected'  : false,
    'isYours' : false
  },
  'p-2' : {
    'name' : 'Ashish',
    'position' : 0,
    'selected'  : false,
    'isYours' : false
  },
  'p-3' : {
    'name' : 'Troll Kid',
    'position' : 0,
    'selected'  : false,
    'isYours' : false
  },
  'p-4' : {
    'name' : 'Trollmaster',
    'position' : 0,
    'selected'  : false,
    'isYours' : false
  },
  'p-5' : {
    'name' : 'NaMo NaMo',
    'position' : 0,
    'selected'  : false,
    'isYours' : false
  },
  'p-6' : {
    'name' : 'Pappu',
    'position' : 0,
    'selected'  : false,
    'isYours' : false
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
    $('.game-player[type='+player+'] .player-avatar').attr('type','sad');
    $('.game-player:not([type='+player+']) .player-avatar').attr('type','happy');
    var callback = function(){
      $('.game-player[type='+player+'] .player-avatar').attr('type','normal');
      $('.game-player:not([type='+player+']) .player-avatar').attr('type','normal');
    }
    var length = snakeBody.length-1;
    for(var i=1;i<=length;i++)
      gamePlay.moveAvatar(player,snakeBody[i-1],snakeBody[i],800,(i==length)?callback:null);
    characters[player].position = snakeBody[length];
  },
  ladderHit : function(player,ladder){
    $('.game-player[type='+player+'] .player-avatar').attr('type','happy');
    $('.game-player:not([type='+player+']) .player-avatar').attr('type','angry');
    var callback = function(){
      $('.game-player[type='+player+'] .player-avatar').attr('type','normal');
      $('.game-player:not([type='+player+']) .player-avatar').attr('type','normal');
    }
    gamePlay.moveAvatar(player,ladder[0],ladder[1],800,callback);
    characters[player].position = ladder[1];
  },
  diceMove : function(player,dice){
    var source = characters[player].position;
    var sourceX = parseInt(source%10);
    var delay = 0;
    if(source + dice <= 99){
      var dest = (sourceX+dice <= 9)? (source+dice) : (source+(9-sourceX));
      gamePlay.moveAvatar(player,source,dest,1000);
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
  generateMeme  : function(winner,loser,imageCase){
    $('.winner').attr('type',winner);
    $('.winner .player-avatar').attr('type','happy');
    $('.loser').attr('type',loser);
    $('.loser .player-avatar').attr('type',imageCase=='image-battle'?'happy':'sad');
    var topMemeMessage = '';
    var bottomMemeMessage = '';
    if(imageCase === 'image-battle'){
      topMemeMessage = characters[winner].name + memeMessage[imageCase][0].top + characters[loser].name;
      bottomMemeMessage = memeMessage[imageCase][0].bottom;
    }else if(imageCase === 'image-result'){
      topMemeMessage = memeMessage[imageCase][randomNumber-1].top;
      bottomMemeMessage = memeMessage[imageCase][randomNumber-1].bottom;
    }else{
      topMemeMessage = memeMessage[imageCase][randomNumber-1].top + (imageCase==='image-winner'?characters[winner].name:characters[loser].name);
      bottomMemeMessage = memeMessage[imageCase][randomNumber-1].bottom;
    }
    $('.game-message.top').html(topMemeMessage);
    $('.game-message.bottom').html(bottomMemeMessage);
    $('#memeModal').attr('type',imageCase+'-'+randomNumber).modal('show');
    setTimeout(function(){
      $('#memeModal').modal('hide');
    },3000);
  },
  initGameBox : function(){
    randomNumber = Math.floor((Math.random() * 2) + 1);
    $.each(characters, function(i,obj){
       if(obj.selected){
         var message = obj.isYours?'Your Turn':'Rival Turn';
         var gameBoard = '<div class="game-player" type="' + i + '">' +
                            '<div class="player-avatar"></div>' +
                         '</div>';
         var miniScoreBoard = '<div class="mini-score-board" type="' + i + '">' + obj.name + gameBoard + '<div class="player-message hide text-color-'+ i +'">'+ message +'</div></div>';
         var scoreBoard = '<div class="score-box">' +
                            '<div class="score-board" type="' + i + '">' + obj.name + gameBoard +'<div class="player-message hide text-color-'+ i +'">'+ message +'</div></div>' +
                          '</div>';
         $('.game-board').append(gameBoard);
         $('.mini-score-box').append(miniScoreBoard);
         $('.box.half-box:last-child').append(scoreBoard);
         if($('.js-rollDice').attr('player') === undefined){
           $('.js-rollDice').attr('player',i);
           $('.player-message.text-color-'+ i ).removeClass('hide');
         }
       }
    });
    gamePlay.findCompetitors();
    gamePlay.generateMeme(competitors[0],competitors[1],'image-battle');
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
        competitors.push(i);
      }
    });
  },
  initSnakeLadderGame : function(){

    var socket = io();

    $('.js-rollDice').click(function(){
      var player = $(this).attr('player');
      if($(this).attr('disabled') !== 'disabled' && characters[player].isYours){
        var dice = Math.floor((Math.random() * 6) + 1);
        socket.emit('dice',{player:player,isYours:characters[player].isYours,dice:dice});

        var player2 = gamePlay.findNextOpponent(player);
        $('.dice-show .message').fadeOut();
        $('.dice-show').addClass('animate');
        $('.js-rollDice').attr('disabled',true);
        setTimeout(function(){
          $('.dice-show .message').attr('type',player).html(dice).fadeIn();
          $('.dice-show').removeClass('animate');
          $('.js-rollDice').attr('player',(dice == 6)?player:player2);
          gamePlay.diceMove(player,dice);
          if(dice != 6){
            $('.player-message.text-color-'+player).fadeOut();
            $('.player-message.text-color-'+player2).fadeIn();
          }
          $('.js-rollDice').attr('disabled',false);
        },2000);

        if(characters[player].position == 99){
          gamePlay.generateMeme(player,player2,'image-result');
          setTimeout(function(){
            gamePlay.generateMeme(player,player2,'image-winner');
          },4000);
          setTimeout(function(){
            gamePlay.generateMeme(player,player2,'image-loser');
          },8000);
          setTimeout(function(){
            location.href = location.href
          },12000);
        }
      }
    });

    $('.select-box').click(function(){
      var player = $(this).attr('type');
      if(!$(this).hasClass('selected')){
        if($('.select-box.selected').length < 2){
          $(this).addClass('selected');
          $(this).find('.player-name').addClass('text-color-'+player);
          characters[player].selected = true;
          characters[player].isYours = true;
        }
      }else{
        if(characters[player].isYours){
          $(this).removeClass('selected');
          $(this).find('.player-name').removeClass('text-color-'+player);
          characters[player].selected = false;
          characters[player].isYours = false;
        }
      }

      socket.emit('selection',{player:player,selection:characters[player].selected,isYours:characters[player].isYours});

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

    socket.on('selection',function(data){
      if(characters[data.player].selected != data.selection){
        characters[data.player].selected = data.selection;
        if(data.selection){
          if($('.select-box.selected').length < 2){
            $('.select-box[type='+data.player+']').addClass('selected');
            $('.select-box[type='+data.player+']').find('.player-name').addClass('text-color-'+data.player);
            characters[data.player].isYours = !data.isYours;
          }
        }else{
          $('.select-box[type='+data.player+']').removeClass('selected');
          $('.select-box[type='+data.player+']').find('.player-name').removeClass('text-color-'+data.player);
        }
        if($('.select-box.selected').length == 2){
          $('.continue-button').removeClass('hide');
        }else{
          $('.continue-button').addClass('hide');
        }
      }
    });

    socket.on('dice',function(data){
     if(characters[data.player].selected && !characters[data.player].isYours){
       var player2 = gamePlay.findNextOpponent(data.player);
       $('.dice-show .message').fadeOut();
       $('.dice-show').addClass('animate');
       $('.js-rollDice').attr('disabled',true);
       setTimeout(function(){
         $('.dice-show .message').attr('type',data.player).html(data.dice).fadeIn();
         $('.dice-show').removeClass('animate');
         $('.js-rollDice').attr('player',(data.dice == 6)?data.player:player2);
         gamePlay.diceMove(data.player,data.dice);
         if(data.dice != 6){
           $('.player-message.text-color-'+data.player).fadeOut();
           $('.player-message.text-color-'+player2).fadeIn();
         }
         $('.js-rollDice').attr('disabled',false);
       },2000);
       if(characters[data.player].position == 99){
         gamePlay.generateMeme(data.player,player2,'image-result');
         setTimeout(function(){
           gamePlay.generateMeme(data.player,player2,'image-winner');
         },4000);
         setTimeout(function(){
           gamePlay.generateMeme(data.player,player2,'image-loser');
         },8000);
         setTimeout(function(){
           location.href = location.href
         },12000);
       }
     }
    });

  }
};