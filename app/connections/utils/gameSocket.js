module.exports = function(io){
  io.on('connection', function(socket){
    socket.on('disconnect', function(){
    });
    socket.on('selection', function(msg){
      io.emit('selection', msg);
    });
    socket.on('dice', function(msg){
      io.emit('dice', msg);
    });
  });
}