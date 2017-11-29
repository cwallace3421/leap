player enters
game server finds world with space
adds player to world
world sets up socket logic on player
world adds player to waiting queue

if (room)
	player stays in waiting queue as it means a game is in progress
else
	if players in waiting queue >= minSize, world starts new room

when new room spawns move all players in waiting queue to playing array





login state
	title screen
	socket connection isn't setup
	scrolling background
	maybe news and updates at the side
	entry to the game

waiting state
	not enough players to start game
	has socket connection
	scrolling background
	waiting aniamtion
	game will start automatically when enough players

playing state
	only in this state if there for game start
	count down at start
	has player control

spectating state
	only in this state if join when game is in progress or die during game
	free look camera
	no player
	maybe scoreboard




socket connection -> handshake -> connection event

handshake
	create player object

connection event
	verifiy connection
	create or join world
	emit WORLD_JOINED

WORLD_JOINED ack
	init socket logic
	join room
	emit ROOM_JOINED



Client Countdown Scenarios

Joining Game:
	In waiting state so no countdown yet [Event]
	Countdown in progress [Event]
	Game in progress, no countdown