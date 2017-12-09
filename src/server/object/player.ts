class Player {

	private id : string;
	private nick : string;
	private socket : SocketIO.Socket;
	private position : { x : number; y : number };
	private keys : { up : boolean; down : boolean; left : boolean; right : boolean;	jump : boolean; attack : boolean };
	private alive : boolean;
	private lastUpdated : number;

	constructor(socket : SocketIO.Socket, id : string, nick : string, x = 0, y = 0) {
		this.id = id;
		this.socket = socket;
		this.position = {
			x: x,
			y: y
		};
		this.keys = {
			up: false,
			down: false,
			left: false,
			right: false,
			jump: false,
			attack: false
		};
		this.nick = nick;
		this.alive = true;
		this.isUpdated();
	}

	/**
	 * Update player state with packet
	 * @public
	 * @param {any} packet
	 */
	public update(packet : any) {
		for (let key in packet) {
			if (this.keys.hasOwnProperty(key)) {
				this.keys[key] = packet[key];
			}
		}
		this.isUpdated();
	}

	/**
	 * Tick players logic
	 * @public
	 * @param {number} delta
	 */
	public tick(delta : number) {
		delta = 1;
		let speed = 1;
		if (this.keys.up) {
			this.position.y -= speed * delta;
		} else if (this.keys.down) {
			this.position.y += speed * delta;
		}

		if (this.keys.left) {
			this.position.x -= speed * delta;
		} else if (this.keys.right) {
			this.position.x += speed * delta;
		}
	}

	/**
	 * Set player's x and y position
	 * @public
	 * @param {number} x
	 * @param {number} y
	 */
	public setPosition(x : number, y : number) {
		this.position.x = x;
		this.position.y = y;
	}

	/**
	 * Does the player have this socket?
	 * @public
	 * @param {SocketIO.Socket} socket
	 */
	public hasSocket(socket : SocketIO.Socket) {
		return this.socket.id === socket.id;
	}

	/**
	 * Does the provided player equal this player?
	 * @public
	 * @param player
	 */
	public equals(player : Player) {
		return this.id === player.getId() && this.nick === player.getNick() && this.socket.id === player.getSocket().id;
	}

	/**
	 * Get the player id
	 * @public
	 */
	public getId() {
		return this.id;
	}

	/**
	 * Get the player nickname
	 * @public
	 */
	public getNick() {
		return this.nick;
	}

	/**
	 * Get the player socket
	 * @public
	 */
	public getSocket() {
		return this.socket;
	}

	/**
	 * Gets a packet for this player
	 * @public
	 */
	public getPacket() {
		return {
			id: this.id,
			nick: this.nick,
			x: this.position.x,
			y: this.position.y,
			alive: this.alive,
		};
	}

	/**
	 * Set this players alive state
	 * @public
	 * @param {boolean} alive
	 */
	public setAlive(alive : boolean) {
		this.alive = alive;
	}

	/**
	 * Is this player alive?
	 * @public
	 */
	public isAlive() {
		return this.alive;
	}

	/**
	 * Update the players last updated with nows timestamp
	 * @private
	 */
	private isUpdated() {
		this.lastUpdated = (+ new Date());
	}

	/**
	 * Call tick on all the provided players
	 * @public
	 * @static
	 * @param {Player[]} array
	 * @param {number} delta
	 */
	public static tickAll(array : Player[], delta : number) {
		for (let i = 0; i < array.length; i++) {
			if (array[i].isAlive()) {
				array[i].tick(delta);
			}
		}
	}

	/**
	 * Get the packets of all the provided players
	 * @public
	 * @static
	 * @param {Player[]} array
	 */
	public static getAllPackets(array : Player[]) {
		let players = [];
		for (let i = 0; i < array.length; i++) {
			players.push(array[i].getPacket());
		}
		return players;
	}

}

export default Player;