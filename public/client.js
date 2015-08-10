var socket = io();

var connectionCount = document.getElementById('connection-count');
var statusMessage   = document.getElementById('status-message');
var voteTally       = document.getElementById('vote-total');
var buttons = document.querySelectorAll("#choices button");

for (var i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener("click", function() {
    socket.send('voteCast', this.innerText);
  });
}


socket.on('statusMessage', function(message) {
  statusMessage.innerText = message;
});

socket.on('userConnection', function(count) {
  connectionCount.innerText = 'Connected Users: ' + count;
});


socket.on('voteCount', function(votes) {
    voteTally.innerText = "Your Vote Breakdown: "

  for (vote in votes){
    voteTally.appendChild( document.createTextNode(" " + vote + ": " + votes[vote]) )

  }
})
