class Incoming {
	constructor(id, nick) {
		this.id = id;
		this.nick = nick;
		this.timestamp = (+ new Date());
	}
}
module.exports = Incoming;