import Constants from '../shared/js/constants';
import Incoming from './model/incoming';
import Player from './object/player';
import Room from './object/room';
import Utils from './utils/utils';

class GameServer {

	private incomingConnections : Incoming[];
	private io : SocketIO.Server;
	private room : Room;
	private players : Player[];
	private minPlayers : number;
	private maxPlayers : number;
	private tickIntervalId : number;

	/**
	 * Start the game server
	 * @public
	 * @param {SocketIO.Server} io
	 */
	public start(io : SocketIO.Server) {
		this.incomingConnections = [];
		this.io = io;
		this.room = new Room(this);
		this.players = [];
		this.minPlayers = 2;
		this.maxPlayers = 25;
		this.initServerSocketLogic();
		this.tickIntervalId = setInterval(this.tick.bind(this, Constants.SERVER.TICK_RATE), Constants.SERVER.TICK_RATE);
	}

	/**
	 * Add a new id and nick to the incoming list
	 * @public
	 * @param {string} id
	 * @param {string} nick
	 */
	public incomingID(id : string, nick : string) {
		this.incomingConnections.push(new Incoming(id, nick));
		// TODO: Check and Remove old IDs
	}

	/**
	 * Init logic for socket connections
	 * @private
	 */
	private initServerSocketLogic() {
		this.io.use((socket, next) => {
			const id = socket.handshake.query.id;
			const nick = socket.handshake.query.nick;

			if (id && nick) {
				for (let i = 0; i < this.incomingConnections.length; i++) {
					if (this.incomingConnections[i].equals(id, nick)) {
						this.incomingConnections[i].setSocketId(socket.id);
						return next();
					}
				}
			}
			next(new Error('Authentication Error: Unexpected Connection'));
		});

		this.io.on(Constants.EVENTS.CONNECTION, this.socketOnConnection.bind(this));
	}

	/**
	 * Logic for when a socket successfully connects
	 * @private
	 * @param {SocketIO.Socket} socket
	 */
	private socketOnConnection(socket : SocketIO.Socket) {
		let myIncoming : Incoming;
		for (let i = 0; i < this.incomingConnections.length; i++) {
			if (this.incomingConnections[i].getSocketId() === socket.id) {
				myIncoming = this.incomingConnections[i];
				break;
			}
		}
		const canConnect = myIncoming && Utils.timeSince(myIncoming.getTimestamp()) < 5;

		if (canConnect) {
			const player = new Player(socket, myIncoming.getId(), myIncoming.getNick());
			player.getSocket().emit(Constants.EVENTS.WORLD_JOINED, null, (ack) => {
				// TODO: Check acknowledgement
				this.initPlayerSocketLogic(player);
				this.players.push(player);
				this.room.newPlayer(player);
				console.log(`${player.getNick()} | ${player.getId()} has joined`);
			});
			console.log(`${player.getNick()} | ${player.getId()} socket connection received`);
		} else {
			socket.disconnect();
		}
	}

	/**
	 * Init socket logic for a player
	 * @private
	 * @param {Player} player
	 */
	private initPlayerSocketLogic(player : Player) {
		const socket = player.getSocket();

		socket.on(Constants.EVENTS.CLIENT_UPDATE, (data) => {
			if (player.isAlive() && this.room.isState(Constants.PLAYING_STATES.PLAYING)) {
				player.update(data);
			}
		});

		socket.on(Constants.EVENTS.DISCONNECT, () => {
			if (this.players.length > 0) {
				for (let i = 0; i < this.players.length; i++) {
					if (this.players[i].equals(player)) {
						this.players.splice(i, 1);
						console.log(`${player.getNick()} | ${player.getId()} has just disconnected`);
						return;
					}
				}
			}
		});
	}

	/**
	 * Tick the game server logic
	 * @private
	 * @param {number} delta
	 */
	private tick(delta : number) {
		this.room.tick(delta);
	}

	/*
		Getters & Setters
	*/
	public canJoin() {
		return this.players.length <= this.maxPlayers;
	}

	public getIO() {
		return this.io;
	}

	public getPlayers() {
		return this.players;
	}

	public getMinPlayers() {
		return this.minPlayers;
	}

	public getMaxPlayers() {
		return this.maxPlayers;
	}

	public getNumberAlive() {
		let count = 0;
		for (let i = 0; i < this.players.length; i++) {
			if (this.players[i].isAlive()) {
				count++;
			}
		}
		return count;
	}

}

export default GameServer;