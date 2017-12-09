class Incoming {

	private id : string;
	private nick : string;
	private timestamp : number;
	private socketId : string;

	constructor(id, nick) {
		this.id = id;
		this.nick = nick;
		this.timestamp = (+ new Date());
	}

	public getId() {
		return this.id;
	}

	public getNick() {
		return this.nick;
	}

	public getTimestamp() {
		return this.timestamp;
	}

	public getSocketId() {
		return this.socketId;
	}

	public setSocketId(socketId : string) {
		this.socketId = socketId;
	}

	public equals(id : string, nick : string) {
		return this.id === id && this.nick === nick;
	}

}

export default Incoming;