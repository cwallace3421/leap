import Constants from '../shared/js/constants';
import Incoming from './model/incoming';
import Player from './object/player';
import World from './object/world';

class GameServer {

	private INCOMING = [];
	private PLAYERS = [];
	private WORLDS = [];

	private io;

	start(io) {
		this.io = io;
		this._initSocketLogic();
	}

	// :: Add A New Id And Nick To the INCOMING List
	incomingID(id, nick) {
		this.INCOMING.push(new Incoming(id, nick));
		// TODO: Check and Remove old IDs
	}

	// :: Logic For When A Socket Successfully Connects
	_socketOnConnection(socket) {
		let player = this._getPlayerFromSocket(socket);
		if (!player) {
			socket.disconnect();
		} else {
			console.log(player.nick + ' | ' + player.id + ' socket connection received, joining a world');
			this._findOrCreateWorld().join(player);
		}
	}

	// :: Find A World With Space, Or Create A New World
	_findOrCreateWorld() {
		for (let i = 0; i < this.WORLDS.length; i++) {
			if (this.WORLDS[i].canJoin()) {
				return this.WORLDS[i];
			}
		}
		let world = new World(this.io);
		this.WORLDS.push(world);
		world.tickObj = setInterval(world.tick.bind(world, 1000 / 20), 1000 / 20);
		return world;
	}

	// :: Init Logic For Socket Connections
	_initSocketLogic() {
		let io = this.io;

		// -- Make Sure Incoming Connection Is Valid
		io.use((socket, next) => {
			let id = socket.handshake.query.id;
			let nick = socket.handshake.query.nick;
			if (id && nick) {
				for (let i = 0; i < this.INCOMING.length; i++) {
					if (this.INCOMING[i].id === id) {
						this._createPlayerObject(id, nick, socket);
						return next();
					}
				}
			}
			next(new Error('Authentication Error: Unexpected Connection'));
		});

		// -- Setup Socket Connection
		io.on(Constants.EVENTS.CONNECTION, this._socketOnConnection.bind(this));
	}

	// :: Remove ID From INCOMING And Create New Player Object
	_createPlayerObject(id, nick, socket) {
		for (let i = 0; i < this.INCOMING.length; i++) {
			if (this.INCOMING[i].id === id) {
				this.INCOMING.splice(i, 1);
				break;
			}
		}
		this.PLAYERS.push(new Player(id, socket, nick));
	}

	// :: Get Player Object From PLAYERS Based On A Socket Object
	_getPlayerFromSocket(socket) {
		if (this.PLAYERS.length === 0 || !socket) {
			return undefined;
		}

		for (let i = 0; i < this.PLAYERS.length; i++) {
			if (this.PLAYERS[i].hasSocket(socket)) {
				return this.PLAYERS.splice(i, 1)[0];
			}
		}
		return undefined;
	}

}

export default GameServer;