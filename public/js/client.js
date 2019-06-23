var socket = io();
var nbOfGames;
var winCountYou = 0;
var winCountOpponent = 0;

function sound(src) {
	this.sound = document.createElement("audio");
	this.sound.src = src;
	this.sound.setAttribute("preload", "auto");
	this.sound.setAttribute("controls", "none");
	this.sound.style.display = "none";
	document.body.appendChild(this.sound);
	this.play = function(){
		this.sound.play();
	}
	this.stop = function(){
		this.sound.pause();
	}
}
var soundHit=new sound("boom.mp3");
var soundMiss=new sound("miss.mp3");
var soundSink=new sound("sink.mp3");
var soundGameOver=new sound("gameOver.mp3");

$(function() {

  socket.on('playSoundHit', function() {
    soundHit.play();
  });

  socket.on('playSoundMiss', function() {
    soundMiss.play();
  });

  socket.on('playSoundSink', function() {
    soundSink.play();
  });

  /**
   * Successfully connected to server event
   */
  socket.on('connect', function() {
    console.log('Connected to server.');
    winCountYou = 0;
    winCountOpponent = 0;
    $('#disconnected').hide();
    $('#waiting-room').show();   
  });

  /**
   * Disconnected from server event
   */
  socket.on('disconnect', function() {
    console.log('Disconnected from server.');
    $('#waiting-room').hide();
    $('#game').hide();
    $('#disconnected').show();
  });

  /**
   * User has joined a game
   */
  socket.on('join', function(gameId) {
    nbOfGames = gameId;
    Game.initGame();
    updateWinCounts();
    $('#messages').empty();
    $('#disconnected').hide();
    $('#waiting-room').hide();
    $('#game').show();
    $('#game-number').html(nbOfGames);
  })

  /**
   * Update player's game state
   */
  socket.on('update', function(gameState) {    
    Game.setTurn(gameState.turn);
    Game.updateGrid(gameState.gridIndex, gameState.grid);
  });

  /**
   * Game chat message
   */
  socket.on('chat', function(msg) {
    $('#messages').append('<li><strong>' + msg.name + ':</strong> ' + msg.message + '</li>');
    $('#messages-list').scrollTop($('#messages-list')[0].scrollHeight);
  });

  /**
   * Game notification
   */
  socket.on('notification', function(msg) {
    $('#messages').append('<li>' + msg.message + '</li>');
    $('#messages-list').scrollTop($('#messages-list')[0].scrollHeight);
  });

  function updateWinCounts() {
    $('#you').html("<h3>Sen - " + winCountYou + "</h3>");
    $('#opponent').html("<h3>Rakibin - "+winCountOpponent+"</h3>");
  }

  /**
   * Change game status to game over
   */
  socket.on('gameover', function(isWinner) {
    console.log('gameover');
    if(isWinner) {
      winCountYou++;
    } else {
      winCountOpponent++;
    }
    updateWinCounts();
    soundGameOver.play();
    Game.setGameOver(isWinner);
  });
  
  /**
   * Leave game and join waiting room
   */
  socket.on('leave', function() {
    $('#game').hide();
    $('#waiting-room').show();
  });

  /**
   * Send chat message to server
   */
  $('#message-form').submit(function() {
    socket.emit('chat', $('#message').val());
    $('#message').val('');
    return false;
  });

});

/**
 * Send leave game request
 * @param {type} e Event
 */
function sendLeaveRequest(e) {
  e.preventDefault();
  socket.emit('leave');
}

/**
 * Send shot coordinates to server
 * @param {type} square
 */
function sendShot(square) {
  socket.emit('shot', square);
}
