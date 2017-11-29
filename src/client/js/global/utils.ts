class Utils {

	/**
	 * Use as default parameter to make argument required
	 * @public
	 * @static
	 */
	public static Required() {
		throw new Error('param is required');
	}

	/**
	 * Shallow copy a object
	 * @public
	 * @static
	 * @param {Object} obj - object to copy
	 */
	public static ShallowCopyObject(obj : object) {
		return {...obj};
	}

	/**
	 * Does obj1 equal obj2
	 * @public
	 * @static
	 * @param {Object} obj1
	 * @param {Object} obj2
	 * @returns {boolean} does it equal
	 */
	public static ShallowCompareObject(obj1 : object, obj2 : object) {
		for (let prop in obj1) {
			if (!obj1.hasOwnProperty(prop)) {
				continue;
			} else if (obj1[prop] !== obj2[prop]) {
				return false;
			}
		}
		return true;
	}

	/**
	 * Create group for game and apply scale
	 * @public
	 * @static
	 * @param {Phaser.Game} game
	 * @param {Number} scale
	 */
	public static CreateGroup(game : Phaser.Game, scale : number) {
		const group = game.add.group();
		group.scale.set(scale);
		return group;
	}

	/**
	 * Generates an event function name from a string
	 * @public
	 * @static
	 * @param {String} eventName
	 */
	public static GenerateEventFunctionName(eventName : string) {
		return 'event' + eventName.replace('_', '').toUpperCase();
	}

}

export default Utils;