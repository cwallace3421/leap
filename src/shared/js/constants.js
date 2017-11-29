const Constants = {

	CLIENT_DEBUG: false,

	LOGIN_STATE: 'LOGIN',
	WAITING_STATE: 'WAITING',
	PLAYING_STATE: 'PLAYING',

	OBJECT_SCALE: 3,
	ENVIRONMENT_SCALE: 3,
	MAP_PADDING: 300,
	TILE_SIZE: 56,

	ROOM_STATES: {
		WAITING: 0,
		COUNTDOWN: 1,
		PLAYING: 2,
		FINISH: 3,
	},

	PLAYING_STATES: {
		WAITING: 0,
		COUNTDOWN: 1,
		PLAYING: 2,
		FINISH: 3,
		SPECTATING: 4,
	},

	EVENTS: {
		CONNECTION: 'connection',
		DISCONNECT: 'disconnect',
		COUNTDOWN_START: 'countdown_start',
		COUNTDOWN_DONE: 'countdown_done',
		WORLD_JOINED: 'world_joined',
		ROOM_JOINED: 'room_joined',
		CLIENT_UPDATE: 'client_update',
		SERVER_UPDATE: 'server_update',
	}

};
module.exports = Constants;