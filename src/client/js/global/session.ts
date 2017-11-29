import { PlayerPacket } from "../playing/interface/player";

const Session : Session = {
	Game: null,
	Id: null,
	WorldId: null,
	State: 0,
	Countdown: 0,
	CountdownActive: false,
	Nick: null,
	Players: null,
	Map: null,
	MapChanges: null,
	Self: null,
	Socket: null,
};

interface Session {
	Game : Phaser.Game;
	Id : string;
	WorldId : string;
	State : number;
	Countdown : number;
	CountdownActive : boolean;
	Nick : string;
	Players : Array<PlayerPacket>;
	Map : Array<Array<Tile>>;
	MapChanges : Array<Array<Tile>>;
	Self : PlayerPacket;
	Socket : SocketIOClient.Socket;
}

interface Tile {
	type : number;
	x : number;
	y : number;
}

export default Session;