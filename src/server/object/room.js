const Constants = require('../../shared/js/constants.js');
const Helper = require('../utils/helper.js');
const RoomMap = require('./roommap.js');
const Player = require('./player.js');

class Room {

	constructor(world) {
		this.countdown = 10;
		this.world = world;
		this.map = new RoomMap();
		this._log('New room created');
		this.setState(Constants.ROOM_STATES.WAITING);
	}

	_startCountDown() {
		this.countdownTimestamp = this._getUnix();
		this.setState(Constants.ROOM_STATES.COUNTDOWN);
		this.world.getIO().in(this.world.getID()).emit(Constants.EVENTS.COUNTDOWN_START, {
			countdown: this.countdown
		});
	}

	_start() {
		this.world.getIO().in(this.world.getID()).emit(Constants.EVENTS.COUNTDOWN_DONE);
		this.setState(Constants.ROOM_STATES.PLAYING);
		// Should we send it to all, or only in the playing array?
	}

	newPlayer(player) {
		if (this.getState === Constants.PLAYING_STATES.PLAYING || this.getState === Constants.PLAYING_STATES.FINISH) {
			player.setAlive(false);
		}

		let position = this.map.getSpawn();
		player.setPosition(position.x, position.y);

		let initPacket = this._getInitPacket();
		player.socket.emit(Constants.EVENTS.ROOM_JOINED, initPacket);
		// Say hello to all other players
	}

	tick(delta) {
		switch (this.state) {

			// Playing State
			case Constants.ROOM_STATES.PLAYING: {
				this.map.tick(delta);
				Player.tickAll(this.world.getPlayers(), delta);

				if (this.world.getNumberAlive() <= 1) {
					// this.setState(Constants.ROOM_STATES.FINISH);
				}
				break;
			}

			// Finish State
			case Constants.ROOM_STATES.FINISH: {
				if (!this.finishTimestamp) {
					this.finishTimestamp = this._getUnix();
				} else {
					if (this._timeLeftInCountdown(this.finishTimestamp) === 0) {
						this.resetRoom();
					}
				}
				break;
			}

			// Waiting State
			case Constants.ROOM_STATES.WAITING: {
				if (this.world.getPlayers().length >= this.world.getMinSize()) {
					// What happens if the player count drops below the min size during countdown. Does it matter?
					this._log('Room reached min size ' + this.world.getMinSize() + ', starting countdown');
					this._startCountDown();
				}
				break;
			}

			// Countdown State
			case Constants.ROOM_STATES.COUNTDOWN: {
				if (this._timeLeftInCountdown(this.countdownTimestamp) === 0) {
					this.countdownTimestamp = undefined;
					this._start();
				}
				break;
			}
		}

		this.world.getIO().in(this.world.getID()).emit(Constants.EVENTS.SERVER_UPDATE, this._getUpdatePacket());
	}

	resetRoom() {
		// TODO
	}

	_getInitPacket() {
		return {
			map: this.map.getPacket(),
			players: Player.getAllPackets(this.world.getPlayers()),
			state: this.state,
			countdown: this._timeLeftInCountdown(this.countdownTimestamp)
		};
	}

	_getUpdatePacket() {
		return {
			map: this.map.getPacket(),
			players: Player.getAllPackets(this.world.getPlayers()),
			state: this.state,
			countdown: this._timeLeftInCountdown(this.countdownTimestamp)
		};
	}

	_timeLeftInCountdown(timestamp) {
		if (timestamp) {
			return Math.max((timestamp + this.countdown) - this._getUnix(), 0);
		} else {
			return 0;
		}
	}

	_getUnix() {
		return Math.floor((+new Date()) / 1000);
	}

	_log(message, error) {
		if (error) {
			console.error('ROOM[PARENT:' + this.world.getID() + '] :: ' + message);
		} else {
			console.log('ROOM[PARENT:' + this.world.getID() + '] :: ' + message);
		}
	}

	/*
		Getters & Setters
	*/

	getMap() {
		return this.map;
	}

	getState() {
		return this.state;
	}

	isState(state) {
		return this.state === state;
	}

	getCountdown() {
		return this.countdown;
	}

	setState(state) {
		this.state = state;
		this._log('Room entering state: ' + state);
	}

}
module.exports = Room;