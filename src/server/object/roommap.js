const Constants = require('../../shared/js/constants.js');
const Helper = require('../utils/helper');

class RoomMap {

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

	tick(delta) {

	}

	isOnTile(x, y) {
		console.log('TODO: isOnTile');
		return true;
	}

	getSpawn() {
		const pos = {};
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

	getPacket() {
		return this.map;
	}

}
module.exports = RoomMap;