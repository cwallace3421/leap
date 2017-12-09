import Constants from '../shared/js/constants';
import Incoming from './model/incoming';
import Player from './object/player';
import World from './object/world';

class GameServer {

	private INCOMING = [];
	private PLAYERS = [];
	private WORLDS = [];

	private io : SocketIO.Server;

	/**
	 * Start the game server
	 * @public
	 * @param {SocketIO.Server} io
	 */
	public start(io : SocketIO.Server) {
		this.io = io;
		this.initSocketLogic();
	}

	/**
	 * Add a new id and nick to the incoming list
	 * @public
	 * @param {string} id
	 * @param {string} nick
	 */
	public incomingID(id : string, nick : string) {
		this.INCOMING.push(new Incoming(id, nick));
		// TODO: Check and Remove old IDs
	}

	/**
	 * Logic for when a socket successfully connects
	 * @private
	 * @param {SocketIO.Socket} socket
	 */
	private socketOnConnection(socket : SocketIO.Socket) {
		let player = this.getPlayerFromSocket(socket);
		if (!player) {
			socket.disconnect();
		} else {
			console.log(player.nick + ' | ' + player.id + ' socket connection received, joining a world');
			this.findOrCreateWorld().join(player);
		}
	}

	/**
	 * Find a world with space, or create a new world
	 * @private
	 */
	private findOrCreateWorld() {
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

	/**
	 * Init logic for socket connections
	 * @private
	 */
	private initSocketLogic() {
		let io = this.io;

		// -- Make Sure Incoming Connection Is Valid
		io.use((socket, next) => {
			let id = socket.handshake.query.id;
			let nick = socket.handshake.query.nick;
			if (id && nick) {
				for (let i = 0; i < this.INCOMING.length; i++) {
					if (this.INCOMING[i].id === id) {
						this.createPlayerObject(id, nick, socket);
						return next();
					}
				}
			}
			next(new Error('Authentication Error: Unexpected Connection'));
		});

		// -- Setup Socket Connection
		io.on(Constants.EVENTS.CONNECTION, this.socketOnConnection.bind(this));
	}

	/**
	 * Remove id from incoming list and create new player object
	 * @private
	 * @param {string} id
	 * @param {string} nick
	 * @param {SocketIO.Socket} socket
	 */
	private createPlayerObject(id : string, nick : string, socket : SocketIO.Socket) {
		for (let i = 0; i < this.INCOMING.length; i++) {
			if (this.INCOMING[i].id === id) {
				this.INCOMING.splice(i, 1);
				break;
			}
		}
		this.PLAYERS.push(new Player(id, socket, nick));
	}

	/**
	 * Get player object from players list based on a socket object
	 * @private
	 * @param {SocketIO.Socket} socket
	 */
	private getPlayerFromSocket(socket : SocketIO.Socket) {
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