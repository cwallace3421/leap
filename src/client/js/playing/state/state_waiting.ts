import Constants from '../../../../shared/js/constants_client';
import Playing from '../playing';
import State from '../interface/state';
import Utils from '../../global/utils';

class WaitingState implements State {

	private parent : Playing;

	constructor(parent : Playing) {
		this.parent = parent;
	}

	public update() {

	}

	public destroy() {

	}
}

WaitingState[Utils.GenerateEventFunctionName(Constants.EVENTS.COUNTDOWN_START)] =
function (response : any) {

}

WaitingState[Utils.GenerateEventFunctionName(Constants.EVENTS.COUNTDOWN_DONE)] =
function (response : any) {

}

WaitingState[Utils.GenerateEventFunctionName(Constants.EVENTS.ROOM_JOINED)] =
function (response : any) {

}

WaitingState[Utils.GenerateEventFunctionName(Constants.EVENTS.CLIENT_UPDATE)] =
function (response : any) {

}

export default WaitingState;