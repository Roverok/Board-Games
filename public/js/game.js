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

var gamePlay = {
  moveAvatar : function(fromY, fromX, toY, toX,speed){
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
    $('.game-player').animate({bottom: distY , left: distX},speed);
  },
  snakeBite : function(snakeBody){
    for(var i=1;i<snakeBody.length;i++)
      gamePlay.moveAvatar(parseInt(snakeBody[i-1]/10),snakeBody[i-1]%10,parseInt(snakeBody[i]/10),snakeBody[i]%10,200);
  },
  ladderHit : function(ladder){
    gamePlay.moveAvatar(parseInt(ladder[0]/10),ladder[0]%10,parseInt(ladder[1]/10),ladder[1]%10,200);
  }

};