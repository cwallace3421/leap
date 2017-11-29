import Constants from '../../../../shared/js/constants_client';
import Playing from '../playing';
import State from '../interface/state';
import Utils from '../../global/utils';

class PlayingState implements State {

	private parent : Playing;

	constructor(parent : Playing) {
		this.parent = parent;
	}

	public update() {

	}

	public destroy() {

	}
}

PlayingState[Utils.GenerateEventFunctionName(Constants.EVENTS.COUNTDOWN_START)] =
function (response : any) {

}

PlayingState[Utils.GenerateEventFunctionName(Constants.EVENTS.COUNTDOWN_DONE)] =
function (response : any) {

}

PlayingState[Utils.GenerateEventFunctionName(Constants.EVENTS.ROOM_JOINED)] =
function (response : any) {

}

PlayingState[Utils.GenerateEventFunctionName(Constants.EVENTS.CLIENT_UPDATE)] =
function (response : any) {

}

export default PlayingState;