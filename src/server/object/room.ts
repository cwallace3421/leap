import Constants from '../../shared/constants';
import Helper from '../utils/helper';
import Player from './player';
import RoomMap from './roommap';
import config from '../accessor/configaccessor';

class Room {

	private io : SocketIO.Server;
	private players : Player[];
	private map : RoomMap;
	private countdown : number;
	private minSize : number;
	private maxSize : number;
	private state : number;
	private countdownTimestamp : number;
	private finishTimestamp : number;

	constructor(io : SocketIO.Server, players : Player[]) {
		this.log('New room created');
		this.io = io;
		this.players = players;
		this.map = new RoomMap();
		this.countdown = config.room.countdown;
		this.minSize = config.room.minSize;
		this.maxSize = config.room.maxSize;
		this.setState(Constants.ROOM_STATES.WAITING);
	}

	/**
	 * Start the room start countdown
	 * @private
	 */
	private startCountDown() {
		this.countdownTimestamp = this.getUnix();
		this.setState(Constants.ROOM_STATES.COUNTDOWN);
		this.io.emit(Constants.EVENTS.COUNTDOWN_START, {
			countdown: this.countdown
		});
	}

	/**
	 * Set the room to start
	 * @private
	 */
	private startRoom() {
		this.io.emit(Constants.EVENTS.COUNTDOWN_DONE);
		this.setState(Constants.ROOM_STATES.PLAYING);
	}

	/**
	 * Add a new player to the room
	 * @public
	 * @param {Player} player
	 */
	public newPlayer(player : Player) {
		if (this.getState() === Constants.ROOM_STATES.PLAYING || this.getState() === Constants.ROOM_STATES.FINISH) {
			player.setAlive(false);
		}

		let position = this.map.getSpawn();
		player.setPosition(position.x, position.y);

		let initPacket = this.getInitPacket();
		player.getSocket().emit(Constants.EVENTS.ROOM_JOINED, initPacket);
	}

	/**
	 * Tick the room logic
	 * @public
	 * @param {number} delta
	 */
	public tick(delta : number) {
		switch (this.state) {

			// Playing State
			case Constants.ROOM_STATES.PLAYING: {
				this.map.tick(delta);
				Player.tickAll(this.players, delta);

				if (this.getNumberAlive() <= 1) {
					// this.setState(Constants.ROOM_STATES.FINISH);
				}
				break;
			}

			// Finish State
			case Constants.ROOM_STATES.FINISH: {
				if (!this.finishTimestamp) {
					this.finishTimestamp = this.getUnix();
				} else {
					if (this.timeLeftInCountdown(this.finishTimestamp) === 0) {
						this.resetRoom();
					}
				}
				break;
			}

			// Waiting State
			case Constants.ROOM_STATES.WAITING: {
				if (this.players.length >= this.minSize) {
					// What happens if the player count drops below the min size during countdown. Does it matter?
					this.log('Room reached min size ' + this.minSize + ', starting countdown');
					this.startCountDown();
				}
				break;
			}

			// Countdown State
			case Constants.ROOM_STATES.COUNTDOWN: {
				if (this.timeLeftInCountdown(this.countdownTimestamp) === 0) {
					this.countdownTimestamp = undefined;
					this.startRoom();
				}
				break;
			}
		}

		this.io.emit(Constants.EVENTS.SERVER_UPDATE, this.getUpdatePacket());
	}

	/**
	 * Reset the room
	 * @public
	 */
	public resetRoom() {
		// TODO: implement
	}

	/**
	 * Get the initialization packet for the room
	 * @private
	 * @returns {object}
	 */
	private getInitPacket() {
		return {
			map: this.map.getPacket(),
			players: Player.getAllPackets(this.players),
			state: this.state,
			countdown: this.timeLeftInCountdown(this.countdownTimestamp)
		};
	}

	/**
	 * Get the update packet for the room
	 * @private
	 * @returns {object}
	 */
	private getUpdatePacket() {
		return {
			map: this.map.getPacket(),
			players: Player.getAllPackets(this.players),
			state: this.state,
			countdown: this.timeLeftInCountdown(this.countdownTimestamp)
		};
	}

	/**
	 * Time left on the room start countdown in seconds
	 * @private
	 * @param timestamp
	 * @returns {number}
	 */
	private timeLeftInCountdown(timestamp : number) {
		if (timestamp) {
			return Math.max((timestamp + this.countdown) - this.getUnix(), 0);
		} else {
			return 0;
		}
	}

	/**
	 * Get the current time in unix format
	 * @private
	 * @returns {number}
	 */
	private getUnix() {
		return Math.floor((+new Date()) / 1000);
	}

	/**
	 * Helper for loggin withing the room
	 * @private
	 * @param {string} message
	 * @param {boolean} error
	 */
	private log(message : string, error? : boolean) {
		if (error) {
			console.error('ROOM :: ' + message);
		} else {
			console.log('ROOM :: ' + message);
		}
	}

	/*
		Getters & Setters
	*/
	public getMap() {
		return this.map;
	}

	public getState() {
		return this.state;
	}

	public isState(state : number) {
		return this.state === state;
	}

	public getCountdown() {
		return this.countdown;
	}

	public setState(state : number) {
		this.state = state;
		this.log('Room entering state: ' + state);
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

export default Room;