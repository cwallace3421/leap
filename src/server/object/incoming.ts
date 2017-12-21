class Incoming {

	private id : string;
	private nick : string;
	private timestamp : number;
	private socketId : string;

	constructor(id : string, nick : string) {
		this.id = id;
		this.nick = nick;
		this.timestamp = (+ new Date());
	}

	/*
		Getters & Setters & Helpers
	*/
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