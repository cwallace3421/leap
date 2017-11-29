const uuid = require('uuid/v4');
const Helper = require('../utils/helper.js');
const Constants = require('../../shared/js/constants.js');
const Room = require('./room.js');

class World {

	constructor(io) {
		this.id = uuid();
		this.io = io;
		this._log('New world created');
		this.players = [];
		this.room = new Room(this);
		this.maxSize = 50;
		this.minSize = 2;
		this.tickObj = null;
	}

	join(player) {
		player.socket.emit(Constants.EVENTS.WORLD_JOINED, { worldId: this.id }, (ack) => {
			// Check ack
			this._initPlayerSocketLogic(player);
			this.players.push(player);

			this._log(player.nick + ' | ' + player.id + ' has joined');
			if (this.room) {
				this.room.newPlayer(player);
			}
		});
	}

	tick(delta) {
		this.room.tick(delta);
	}

	_initPlayerSocketLogic(player) {
		let socket = player.socket;

		// Join this world room
		socket.join(this.id);

		socket.on(Constants.EVENTS.CLIENT_UPDATE, (data) => {
			// if (!this.room || !player.isAlive() || !this.room.isState(Constants.PLAYING_STATES.PLAYING)) {
			// 	return;
			// } else {
				player.update(data);
			// }
		});

		socket.on(Constants.EVENTS.DISCONNECT, () => {
			this._log(player.nick + ' | ' + player.id + ' has just disconnected');

			if (this.players.length > 0) {
				for (let i = 0; i < this.players.length; i++) {
					if (this.players[i].equals(player)) {
						this.players.splice(i, 1);
						return;
					}
				}
			}
		});
	}

	canJoin() {
		return this.players.length < this.maxSize;
	}

	_log(message, error) {
		if (error) {
			console.error('WORLD[' + this.id + '] :: ' + message);
		} else {
			console.log('WORLD[' + this.id + '] :: ' + message);
		}
	}

	/*
		Getters & Setters
	*/

	getIO() {
		return this.io;
	}

	getID() {
		return this.id;
	}

	getPlayers() {
		return this.players;
	}

	getNumberAlive() {
		let count = 0;
		for (let i = 0; i < this.players.length; i++) {
			if (this.players[i].isAlive()) {
				count++;
			}
		}
		return count;
	}

	getMinSize() {
		return this.minSize;
	}

	getMaxSize() {
		return this.maxSize;
	}

}
module.exports = World;