import Connection from '../../network/connection';
import Constants from '../../../../shared/constants';
import Resources from '../../global/resources';
import Session from '../../global/session';
import Utils from '../../global/utils';

class MapManager {

	private tilesParent : Phaser.Group;
	private padding : number;
	private tiles : Array<Array<Phaser.Sprite>>;
	private oldMapPacket : object;
	private bounds : Phaser.Rectangle;

	/**
	 * Initializes the map manager
	 * @public
	 */
	constructor() {
		this.vars();
	}

	/**
	 * Setup variables for the map manager
	 * @private
	 */
	private vars() {
		this.tilesParent = Utils.CreateGroup(Session.Game, Constants.ENVIRONMENT_SCALE);
		this.padding = Constants.MAP_PADDING;
		this.tiles = [];
		this.oldMapPacket = null;
	}

	/**
	 * Update the map tiles from the session
	 * @private
	 */
	private updateMap() {

	}

	/**
	 * Check to see if the map has changed in the session from the last update
	 * @private
	 * @returns {boolean} needs updating
	 */
	private needsUpdating() {
		// Get from Session.MapChanges
		return false;
	}

	/**
	 * Update the map
	 * @param {number} delta
	 */
	public update(delta : number) {
		if (!this.tiles.length && Session.Map) {
			this.createMap();
		}

		// check if there has been a change in the mapp
		// animate tiles as apporiate
		if (this.needsUpdating()) {
			this.updateMap();
		}
	}

	/**
	 * Create and store tile sprites from the session, and set the world bounds
	 * @private
	 */
	private createMap() {
		const newMapPacket = Session.Map;
		let boundsWidth = ((Session.Map[0].length * Resources.Tiles.width) + (this.padding * 2)) * Constants.ENVIRONMENT_SCALE;
		let boundsHeight = ((Session.Map[0].length * Resources.Tiles.height) + (this.padding * 2)) * Constants.ENVIRONMENT_SCALE;
		this.bounds = new Phaser.Rectangle(0, 0, boundsWidth, boundsHeight);

		for (let y = 0; y < newMapPacket.length; y++) {
			let row = [];
			for (let x = 0; x < newMapPacket.length; x++) {
				let tilePacket = newMapPacket[y][x];
				if (tilePacket.type <= 0) {
					continue;
				} else {
					let tile = Session.Game.add.sprite(
						tilePacket.x,
						tilePacket.y,
						Resources.Tiles.key
					);
					// let tile = Session.Game.add.sprite(
					// 	this.padding + (x * Resources.Tiles.width),
					// 	this.padding + (y * Resources.Tiles.height),
					// 	Resources.Tiles.key
					// );
					this.createAnimations(tile);
					this.tilesParent.add(tile);
					row.push(tile);
				}
			}
			this.tiles.push(row);
		}
		this.oldMapPacket = newMapPacket;

		Session.Game.world.setBounds(this.bounds.left, this.bounds.top, this.bounds.right, this.bounds.bottom);
	}

	/**
	 * Create the tile animations for the given sprite
	 * @private
	 * @param {Phaser.Sprite} sprite
	 */
	private createAnimations(sprite : Phaser.Sprite) {
		sprite.animations.add('animate');
		// sprite.animations.play('animate', 3, true);
	}

}

export default MapManager;


/* _createMap: function() {
	Session.MAPTILES = [];
	let scale = 3;
	let env = Session.GAME.add.group();
	env.scale.set(scale); //_.ENVSCALE
	let border = 400;
	let boundsSize = ((Session.MAP[0].length * 56) + (border * 2)) * scale;
	let topleft = border;
	let m = Session.MAP;
	let mt = Session.MAPTILES;

	for (let y = 0; y < m.length; y++) {
		let row = [];
		for (let x = 0; x < m.length; x++) {
			if (m[y][x] === 0) {
				continue;
			} else {
				let tile = Session.GAME.add.sprite(
					topleft + (x * 56),
					topleft + (y * 56),
					'platform_tileset'
				);
				tile.animations.add('animate');
				tile.animations.play('animate', 3, true);
				env.add(tile);
				row.push(tile);
			}
		}
		mt.push(row);
	}
	Session.GAME.world.setBounds(0, 0, boundsSize, boundsSize);
}, */