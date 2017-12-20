import Constants from '../../shared/js/constants';
import Helper from '../utils/helper';

class RoomMap {

	private template : number[][];
	private padding : number;
	private tileSize : number;
	private map : number[][];

	constructor() {
		this.template = [
			[1, 1, 1, 1, 1],
			[1, 1, 1, 1, 1],
			[1, 1, 0, 1, 1],
			[1, 1, 1, 1, 1],
			[1, 1, 1, 1, 1]
		];
		this.padding = Constants.MAP_PADDING;
		this.tileSize = Constants.TILE_SIZE;
		this.map = [];
		for (let y = 0; y < this.template.length; y++) {
			let row = [];
			for (let x = 0; x < this.template[0].length; x++) {
				row.push({
					type: this.template[y][x],
					x: this.padding + (x * this.tileSize),
					y: this.padding + (y * this.tileSize)
				});
			}
			this.map.push(row);
		}
	}

	/**
	 * Tick the map logic
	 * @public
	 * @param {number} delta
	 */
	public tick(delta : number) {

	}

	/**
	 * Is the x and y on a tile
	 * @public
	 * @param {number} x
	 * @param {number} y
	 * @returns {boolean}
	 */
	public isOnTile(x : number, y : number) {
		console.log('TODO: isOnTile');
		return true;
	}

	/**
	 * Get a random position on the map
	 * @public
	 * @returns {Position}
	 */
	public getSpawn() {
		const pos : Position = {};
		do {
			pos.x = Helper.randomIntFromInterval(
				Constants.MAP_PADDING + 10,
				Constants.MAP_PADDING - 10 + (this.template[0].length * Constants.TILE_SIZE)
			);
			pos.y = Helper.randomIntFromInterval(
				Constants.MAP_PADDING + 10,
				Constants.MAP_PADDING - 10 + (this.template.length * Constants.TILE_SIZE)
			)
		} while (!this.isOnTile(pos.x, pos.y));
		return pos;
	}

	/**
	 * Get the map packet
	 * @public
	 * @returns {number[][]}
	 */
	public getPacket() {
		return this.map;
	}

}

interface Position {
	x? : number;
	y? : number;
}

export default RoomMap;