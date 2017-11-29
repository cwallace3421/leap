import Keys from '../../global/keys';
import Session from '../../global/session';
import Utils from '../../global/utils';

export default class Camera {

	private speed : number;
	private following : boolean;

	constructor(object? : Phaser.Sprite) {
		this.speed = 1;

		Session.Game.camera.setBoundsToWorld();
		Session.Game.camera.unfollow();

		if (object) {
			this.follow(object);
		} else {
			let bounds = Session.Game.camera.bounds;
			Session.Game.camera.focusOnXY(bounds.centerX, bounds.centerY);
		}
	}

	follow(object : Phaser.Sprite) {
		Session.Game.camera.follow(object, Phaser.Camera.FOLLOW_TOPDOWN, 0.6, 0.6);
		this.following = true;
	}

	unfollow() {
		Session.Game.camera.unfollow();
		this.following = false;
	}

	update(delta : number) {
		if (this.following) return;

		let {x, y} = Session.Game.camera;

		if (this._isAnyDown(Keys.Camera.Up)) {
			y -= (this.speed * delta);
		} else if (this._isAnyDown(Keys.Camera.Down)) {
			y += (this.speed * delta);
		}

		if (this._isAnyDown(Keys.Camera.Left)) {
			x -= (this.speed * delta);
		} else if (this._isAnyDown(Keys.Camera.Right)) {
			x += (this.speed * delta);
		}

		Session.Game.camera.setBoundsToWorld();
		Session.Game.camera.setPosition(x, y);
	}

	_isAnyDown(keys : Array<number>) {
		for (let i = 0; i < keys.length; i++) {
			if (Session.Game.input.keyboard.isDown(keys[i])) {
				return true;
			}
		}
		return false;
	}

}