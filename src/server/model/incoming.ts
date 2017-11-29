class Incoming {

	private id;
	private nick;
	private timestamp;

	constructor(id, nick) {
		this.id = id;
		this.nick = nick;
		this.timestamp = (+ new Date());
	}

}

export default Incoming;