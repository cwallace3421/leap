import { StatePlaying, StateWaiting } from '../state/states';

import Constants from '../../../../shared/js/constants_client';
import Playing from '../playing';
import State from '../interface/state';

class StateManager {

	private map : Array<State>;

	constructor(parent : Playing) {
		this.map = [];
		this.map[Constants.CLIENT_STATES.WAITING] = new StateWaiting(parent);
		this.map[Constants.CLIENT_STATES.PLAYING] = new StatePlaying(parent);
	}

	public get(index : number) {
		return this.map[index];
	}

}

export default StateManager;