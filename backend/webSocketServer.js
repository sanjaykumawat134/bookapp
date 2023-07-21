const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
const io = require('socket.io')(server);
server.listen(8080,()=>{console.log('websocket server is listen on port 8080')});

// routing
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/client.html');
});

var usernames = {};

// rooms which are currently available in chat
var rooms = ['room1','room2','room3'];

io.sockets.on('connection', function (socket) {
	
    // on click addUser this listens abd executes
	socket.on('adduser', function(username){
		socket.username = username;
		socket.room = 'room1';
		usernames[username] = username;
		socket.join('room1');
		socket.emit('updatechat', 'SERVER', 'you have connected to room1');
		socket.broadcast.to('room1').emit('updatechat', 'SERVER', username + ' has connected to this room');
		socket.emit('updaterooms', rooms, 'room1');
	});

	
	// on click sendChat this listens and emit
	socket.on('sendchat', function (data) {
		io.sockets.in(socket.room).emit('updatechat', socket.username, data);
	});


		// on emit switchRoom this listens and emit
	socket.on('switchRoom', function(newroom){
		socket.leave(socket.room);
		socket.join(newroom);
		socket.emit('updatechat', 'SERVER', 'you have connected to '+ newroom);
		socket.broadcast.to(socket.room).emit('updatechat', 'SERVER', socket.username+' has left this room');
		socket.room = newroom;
		socket.broadcast.to(newroom).emit('updatechat', 'SERVER', socket.username+' has joined this room');
		socket.emit('updaterooms', rooms, newroom);
	});
	

	// when the user disconnect this listens and emit
	socket.on('disconnect', function(){
		delete usernames[socket.username];
		io.sockets.emit('updateusers', usernames);
		socket.broadcast.emit('updatechat', 'SERVER', socket.username + ' has disconnected');
		socket.leave(socket.room);
	});
});