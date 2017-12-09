import Constants from '../shared/js/constants';
import Incoming from './model/incoming';
import Player from './object/player';
import Utils from './utils/utils';
import World from './object/world';

class GameServer {

	private io : SocketIO.Server;
	private incomingConnections : Incoming[];
	private players : Player[];

	/**
	 * Start the game server
	 * @public
	 * @param {SocketIO.Server} io
	 */
	public start(io : SocketIO.Server) {
		this.io = io;
		this.incomingConnections = [];
		this.players = [];
		this.initSocketLogic();
	}

	/**
	 * Init logic for socket connections
	 * @private
	 */
	private initSocketLogic() {
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
			const player = new Player(myIncoming.getId(), socket, myIncoming.getNick());
			console.log(`${player.getNick()} | ${player.getId()} socket connection received, joining a world`);
		} else {
			socket.disconnect();
		}
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

}

export default GameServer;