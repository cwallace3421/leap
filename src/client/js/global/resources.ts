const Resources : ResourcesInt = {

	Player: {
		key: 'character',
		width: 3,
		height: 8,
		spritesheet: {
			frames: 4
		},
		asset: 'assets/char.png'
	},

	Shadow: {
		key: 'shadow',
		width: 5,
		height: 3,
		offset: {
			x: -1,
			y: 6,
		},
		asset: 'assets/shadow.png'
	},

	Tiles: {
		key: 'platform_tileset',
		width: 56,
		height: 56,
		spritesheet: {
			frames: 8
		},
		asset: 'assets/platform_tileset.png'
	}

};

interface ResourcesInt {
	Player : SpriteInt;
	Shadow : SpriteInt;
	Tiles : SpriteInt;
}

interface SpriteInt {
	key : string;
	width : number;
	height : number;
	offset? : {
		x : number;
		y: number;
	};
	spritesheet? : {
		frames : number;
	},
	asset : string;
}

export default Resources;