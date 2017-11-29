import * as socket from 'socket.io';

import bodyparser from 'body-parser';
import compression from 'compression';
import express from 'express';
import gameserver from './src/server/gameserver';
import http from 'http';
import uuid from 'uuid/v4';

const app : any = <Express.Application>express();
const server : http.Server = http.createServer(<any> app);
const io : SocketIO.Server = socket.listen(server);

app.use(compression());
app.use('/almond', express.static('node_modules/almond/'));
app.use('/jquery', express.static('node_modules/jquery/dist/'));
app.use('/phaser', express.static('node_modules/phaser-ce/build/'));
app.use('/css', express.static('src/client/css'));
app.use('/dist', express.static('dist'));
app.use('/assets', express.static('src/client/assets'));

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

app.use(function (err, req, res, next) {
	if (req.xhr) {
		res.status(500).send({
			error: 'Server Error'
		});
	} else {
		next(err);
	}
});

server.listen(process.env.PORT || 8080, function() {
	console.log('Listening on ' + server.address().port);
	gameserver.start(io);
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
		gameserver.incomingID(id);
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