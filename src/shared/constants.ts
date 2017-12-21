const Constants = {

	CLIENT_DEBUG: true,

	LOGIN_STATE: 'LOGIN',
	PLAYING_STATE: 'PLAYING',

	OBJECT_SCALE: 3, // Need to fix this... Assets should not have to be scaled, maybe...
	ENVIRONMENT_SCALE: 3,
	MAP_PADDING: 300,
	TILE_SIZE: 56,

	ROOM_STATES: {
		WAITING: 0,
		COUNTDOWN: 1,
		PLAYING: 2,
		FINISH: 3,
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

export default Constants;