import Connection from './connection';
import Constants from '../../../shared/js/constants_client';
import { PlayerPacket } from '../playing/interface/player';
import Session from '../global/session';
import { Tile } from '../global/session';
import Utils from '../global/utils';

function open() {

	Connection.registerEvent(Constants.EVENTS.ROOM_JOINED, (response : ROOM_JOINED_RES) => {
		Session.Map = response.map;
		Session.Players = response.players;
		Session.State = response.state;
		Session.Countdown = response.countdown;
		Session.CountdownActive = response.countdown > 0;

		for (let i = 0; i < Session.Players.length; i++) {
			if (Session.Id === Session.Players[i].id) {
				Session.Self = Session.Players[i];
			}
		}
	});

	Connection.registerEvent(Constants.EVENTS.COUNTDOWN_START, (response : COUNTDOWN_START_RES) => {
		Session.Countdown = response.countdown;
		Session.CountdownActive = true;
	});

	Connection.registerEvent(Constants.EVENTS.COUNTDOWN_DONE, (response : COUNTDOWN_DONE_RES) => {
		Session.Countdown = 0;
		Session.CountdownActive = false;
	});

	Connection.registerEvent(Constants.EVENTS.SERVER_UPDATE, (response : SERVER_UPDATE_RES) => {
		Session.MapChanges = response.map;
		Session.Players = response.players;
		Session.State = response.state;

		if (response.countdown) {
			Session.Countdown = response.countdown;
		}
	});

}

export default {
	open: open
};

// Room Joined Response Object
interface ROOM_JOINED_RES {
	map : Array<Array<Tile>>;
	players : Array<PlayerPacket>;
	state : number;
	countdown : number;
}

// Countdown Start Response Object
interface COUNTDOWN_START_RES {
	countdown : number;
}

// Countdown Done Response Object
interface COUNTDOWN_DONE_RES {

}

// Server Update Response Object
interface SERVER_UPDATE_RES {
	map : Array<Array<Tile>>;
	players : Array<PlayerPacket>;
	state : number;
	countdown? : number;
}