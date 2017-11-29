class Player {

	private id;
	private socket;
	private position;
	private keys;
	private nick;
	private alive;
	private lastUpdated;

	constructor(id, socket, nick, x = 0, y = 0) {
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
		this._isUpdated();
	}

	update(packet) {
		for (let key in packet) {
			if (this.keys.hasOwnProperty(key)) {
				this.keys[key] = packet[key];
			}
		}
		this._isUpdated();
	}

	tick(delta) {
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

	setPosition(x, y) {
		this.position.x = x;
		this.position.y = y;
	}

	hasSocket(socket) {
		return this.socket.id === socket.id;
	}

	equals(player) {
		return this.id === player.id && this.nick === player.nick;
	}

	getPacket() {
		return {
			id: this.id,
			nick: this.nick,
			x: this.position.x,
			y: this.position.y,
			alive: this.alive,
		};
	}

	setAlive(isAlive) {
		this.alive = isAlive;
	}

	isAlive() {
		return this.alive;
	}

	_isUpdated() {
		this.lastUpdated = (+ new Date());
	}

	public static tickAll = function(array, delta) {
		for (let i = 0; i < array.length; i++) {
			if (array[i].isAlive()) {
				array[i].tick(delta);
			}
		}
	}

	public static getAllPackets = function(array) {
		let players = [];
		for (let i = 0; i < array.length; i++) {
			players.push(array[i].getPacket());
		}
		return players;
	}
}

export default Player;