import * as http from 'http';
import * as socket from 'socket.io';
import * as uuid from 'uuid/v4';

import GameServer from './gameserver';
import app from './app';

const server : http.Server = http.createServer(app);
const io : SocketIO.Server = socket.listen(server);
const game : GameServer = new GameServer();

server.listen(process.env.PORT || 8080, function() {
	console.log('Listening on ' + server.address().port);
	game.start(io);
});

/*
	Should really seperate out the game logic into it's own node server.
	One node server shouldn't be serving the files + running the socket/game logic.
*/
app.get('/', function(request, response) {
	response.sendFile(__dirname + '/index.html');
});

app.post('/enter', function(request, response) {
	response.setHeader('Content-Type', 'application/json');

	let nick = request.body.nick;
	if (nick) {
		let id = uuid();
		response.status(200).send({
			status: 'success',
			message: 'now awaiting socket connection',
			data: {
				id: id,
				nick: nick
			},
		});
		game.incomingID(id, nick);
		console.log(nick + ' | ' + id + ' now awaiting socket connection');
	} else {
		response.status(400).send({
			status: 'error',
			message: 'missing nick',
		});
	}
});

// When a player logs in a id gets generated for them and sent back
// When the player opens the socket to the server, it will send it's id
// The server will match the sent id with the stored nickname?
// Seems like a silly way of doing it. Should we be doing this all just to avoid
//   opening a socket just to login. Should the socket only be opened when the
//   player has successully logged in? Think that should be the case. Then how
//   do we get the nickname the user logs in with?
// Am I over complicating this? Does the player actually login? or just join
//   the game?

// How do we call a function on the GameServer when it is just a function,
// do we need to make it a object??
// GameServer.incomingID(id);