import Connection from '../network/connection';
import Constants from '../../../shared/js/constants_client';
import Session from '../global/session';
import UI from './modules/ui';
import Utils from '../global/utils';

class Login {

	public init() {
		console.info('Starting State: ' + Constants.LOGIN_STATE);
		this.ui();
	}

	public ui() {
		UI.init();
		UI.buttonClick(this.enterClicked.bind(this));
	}

	public preload() {

	}

	public create() {

	}

	public update() {
		// Update the background?
	}

	public resize() {
		Session.Game.scale.setGameSize(window.innerWidth, window.innerHeight);
	}

	public close() {
		UI.destory();
	}

	public enterClicked() {
		UI.clearErrorMessage();

		let username = UI.getUsername();
		if (username) {
			UI.showLoading();
			$.ajax({
				type: 'POST',
				dataType: 'json',
				contentType: 'application/json',
				url: '/enter',
				data: JSON.stringify({ nick: username }),
				cache: false
			}).done(
				this.enterSuccess.bind(this)
			).fail(
				this.enterError.bind(this)
			);
		} else {
			UI.setErrorMessage('Please enter a username to enter the game');
		}
	}

	public enterSuccess(response : { data : any }) {
		this.setSession(response);
		this.close();
		Session.Game.state.start(Constants.PLAYING_STATE);
	}

	public enterError(response : { message : string }) {
		UI.showLogin();
		UI.clearUsername();
		UI.setErrorMessage(response.message);
	}

	public setSession(response : { data : any }) {
		Session.Id = response.data.id;
		Session.Nick = response.data.nick;
	}

};
export default Login;