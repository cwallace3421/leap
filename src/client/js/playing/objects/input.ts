import Connection from '../../network/connection';
import Constants from '../../../../shared/js/constants_client';
import Keys from '../../global/keys';
import Session from '../../global/session';
import Utils from '../../global/utils';

class Input {

	private frozen : boolean;
	private oldState : InputState;
	private newState : InputState;

	constructor(freeze? : boolean) {
		this.frozen = freeze ? true : false;
		this.oldState = {
			up: false,
			right: false,
			down: false,
			left: false,
			jump: false,
			attack: false,
		};
		this.newState = <InputState> Utils.ShallowCopyObject(this.oldState);
	}

	public freeze() {
		this.frozen = true;
	}

	public unfreeze() {
		this.frozen = false;
	}

	public update(delta : number) {
		if (this.frozen) return;

		this.newState.up = this.isAnyDown(Keys.Controller.Up);
		this.newState.right = this.isAnyDown(Keys.Controller.Right);
		this.newState.down = this.isAnyDown(Keys.Controller.Down);
		this.newState.left = this.isAnyDown(Keys.Controller.Left);
		this.newState.jump = this.isAnyDown(Keys.Controller.Jump);
		this.newState.attack = this.isAnyDown(Keys.Controller.Attack);

		if (this.hasStateChanged()) {
			this.oldState = <InputState> Utils.ShallowCopyObject(this.newState);
			Connection.emitEvent(Constants.EVENTS.CLIENT_UPDATE, this.newState);
		}
	}

	private hasStateChanged() {
		return !Utils.ShallowCompareObject(this.newState, this.oldState);
	}

	private isAnyDown(keys : Array<number>) {
		for (let i = 0; i < keys.length; i++) {
			if (Session.Game.input.keyboard.isDown(keys[i])) {
				return true;
			}
		}
		return false;
	}

}

interface InputState {
	up : boolean;
	right : boolean;
	down : boolean;
	left : boolean;
	jump : boolean;
	attack : boolean;
}

export default Input;