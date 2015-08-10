var votes = {};
var http = require('http');
var express = require('express');
// var socketIo = require('socket-io');
// var io = socketIo(server);
var app = express();

app.use(express.static('public'));

app.get('/', function(req, res) {
  res.sendFile(__dirname + 'public/index.html');
});

const port = process.env.PORT || 3000;

const server = http.createServer(app)
            .listen(port, function() {
              console.log('Listening on port ' + port + ".")
            });

var io = require('socket.io')(server);

io.on('connection', function(socket) {
  console.log("A user has connected.", io.engine.clientsCount);

  io.sockets.emit('userConnection', io.engine.clientsCount);
  io.sockets.emit('voteTally', votes);


  socket.emit("statusMessage", 'You have connected.')

  socket.on('message', function(channel, message) {
    if (channel === 'voteCast') {
      votes[socket.id] = message;
      socket.emit('voteCount', countVotes(votes));
      console.log(votes);
    }
  });

  socket.on('disconnect', function() {
    console.log('A user has disconnected.', io.engine.clientsCount);
    delete votes[socket.id];
    console.log(votes);
    io.sockets.emit('userConnection', io.engine.clientsCount);
    socket.emit('voteCount', countVotes(votes));
  });
});



function countVotes(votes) {
  var voteCount = {
    "Chocolate": 0,
    "Vanilla": 0,
    "Rocky Road": 0,
    "Mint Chocolate Chip": 0
  };


  for (vote in votes) {
    voteCount[votes[vote]] ++
  }
  return voteCount;
}



module.exports = server;
