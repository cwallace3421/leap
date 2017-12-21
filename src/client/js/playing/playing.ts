import Camera from './objects/camera';
import Connection from '../network/connection';
import Constants from '../../../shared/constants';
import Countdown from '../global/countdown';
import { ImportantMessage } from './modules/ui';
import Input from './objects/input';
import Listeners from '../network/listeners';
import MapManager from './modules/mapmanager';
import PlayersManager from './modules/playersmanager';
import Resources from '../global/resources';
import Session from '../global/session';
import Utils from '../global/utils';

class Playing {

	/*
		Waiting + Spectating
			Camera controls
		Countdown
			Countdown ui with just camera controls
		Playing
			Player controls
		Finish
			Lock camera on winner + ui
	*/

	private mapManager : MapManager;
	private playersManager : PlayersManager;
	private cameraObj : Camera;
	private inputObj : Input;
	private countdown : Countdown;

	private ui : {
		countdown? : ImportantMessage;
		welcome? : ImportantMessage;
	};

	init() {
		console.info('Starting State: ' + Constants.PLAYING_STATE);

		// Session.GAME.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		Session.Game.stage.disableVisibilityChange = true;
		Session.Game.renderer.clearBeforeRender = false;
		Session.Game.renderer.renderSession.roundPixels = true;

		Connection.start();
		Listeners.open();

		this.ui = {};
		this.mapManager = new MapManager();
		this.playersManager = new PlayersManager();
	}

	create() {
		this.ui.welcome = new ImportantMessage('welcome ' + Session.Nick);
		this.ui.welcome.time(2000, () => {
			this.ui.welcome.kill();
			this.ui.welcome = null;
		});
	}

	update() {
		if (this.playersManager.getMe() && !this.cameraObj && !this.inputObj) {
			this.cameraObj = new Camera();
			this.inputObj = new Input(true);
		}

		this.mapManager.update(1000 / 60);
		this.playersManager.update(1000 / 60);
		this.cameraObj ? this.cameraObj.update(1000 / 60) : void 0;
		this.inputObj ? this.inputObj.update(1000 / 60) : void 0;
		this.updateCountdown();
	}

	updateCountdown() {
		if (Session.CountdownActive) {
				// Update
				// TODO: Countdown can be out of sync, need a way for the countdown in the server update to correct the in progress countdown
			if (this.countdown && this.countdown.isRunning()) {
				this.countdown.update();

				if (this.ui.countdown) {
					let text = this.countdown.get().toString();
					text = text.length === 1 ? ('0' + text) : text;
					this.ui.countdown.setMessage(text);
				}

				// Delete
			} else if (this.countdown && !this.countdown.isRunning()) {
				console.log('killing countdown');
				if (this.ui.countdown) {
					this.ui.countdown.kill();
					this.ui.countdown = null;
				}
				this.countdown = null;

				// Create
			} else if (!this.countdown && Session.Countdown > 0) {
				console.log('creating countdown');
				this.countdown = new Countdown(Session.Countdown, () => {
					this.completeCountdown();
				});
				Session.Countdown = 0;
				this.ui.countdown = new ImportantMessage(this.countdown.get());
				this.cameraObj.follow(this.playersManager.getMe());
			}
		} else {
			if (this.ui.countdown) {
				console.log('killing countdown');
				this.ui.countdown.kill();
				this.ui.countdown = null;
			}

			if (this.countdown) {
				this.countdown.triggerCallback();
				this.countdown = null;
			}
		}
	}

	completeCountdown() {
		console.log('TODO: Countdown complete on client');
		this.inputObj.unfreeze();
	}

	resize() {
		Session.Game.scale.setGameSize(window.innerWidth, window.innerHeight);
	}

	preload() {
		Session.Game.load.spritesheet('platform_tileset', 'assets/platform_tileset.png', 56, 56);
		Session.Game.load.spritesheet('character', 'assets/char.png', 3, 8, 4);
		Session.Game.load.image('shadow', 'assets/shadow.png');
	}

};
export default Playing;

/*

	Player hits the login button
	Socket connection is opened
	Player receives room joined event
	Playing state starts
	Pull data from room joined event into session
	What state is the game in?
		Waiting (
			Frozen Player
			Message On Screen
		)
		Countdown (
			Frozen Player
			Countdown counting down
			Message on screen
		)
		Playing (
			Free control
		)
		Finished

*/