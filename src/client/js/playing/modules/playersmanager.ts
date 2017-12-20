import Connection from '../../network/connection';
import Constants from '../../../../shared/js/constants_client';
import { PlayerPacket } from '../interface/player';
import Resources from '../../global/resources';
import Session from '../../global/session';
import Utils from '../../global/utils';

class PlayersManager {

	private playersParent : Phaser.Group;
	private playersSprites : { [s : string] : Phaser.Sprite; };
	private me : Phaser.Sprite;

	/**
	 * Initializes the player manager
	 * @public
	 */
	constructor() {
		this.vars();
	}

	/**
	 * Setup variables for the players manager
	 * @private
	 */
	private vars() {
		this.playersParent = Utils.CreateGroup(Session.Game, Constants.OBJECT_SCALE);
		this.playersSprites = {};
		this.me = null;
	}

	/**
	 * Update the players
	 * @param {number} delta
	 */
	public update(delta : number) {
		const playerPackets = Session.Players;

		if (playerPackets) {
			for (let i = 0; i < playerPackets.length; i++) {
				if (this.playersSprites[playerPackets[i].id]) {
					this.playersSprites[playerPackets[i].id].position.x = playerPackets[i].x;
					this.playersSprites[playerPackets[i].id].position.y = playerPackets[i].y;
				} else {
					console.log('new player: ' + playerPackets[i].nick);
					this.createPlayer(playerPackets[i]);
				}
				// How to detect a disconnected player?
			}
		}
	}

	/**
	 * Create a player sprite from a player packet
	 * @private
	 * @param {PlayerPacket} packet
	 */
	private createPlayer(packet : PlayerPacket) {
		let id = packet.id;
		let shadowSprite = Session.Game.add.sprite(
			Resources.Shadow.offset.x,
			Resources.Shadow.offset.y,
			Resources.Shadow.key
		);
		shadowSprite.alpha = 0.3;

		let playerSprite = Session.Game.add.sprite(
			packet.x,
			packet.y,
			Resources.Player.key,
			0
		);
		playerSprite.addChild(shadowSprite);
		this.createAnimations(playerSprite);
		this.playersParent.add(playerSprite);
		this.playersSprites[id] = playerSprite;

		if (!packet.alive) {
			playerSprite.visible = false;
		}

		if (Session.Id === id) {
			this.me = playerSprite;
		}

	}

	/**
	 * Create the player animations for the given sprite
	 * @private
	 * @param {Phaser.Sprite} sprite
	 */
	private createAnimations(sprite : Phaser.Sprite) {
		sprite.animations.add('walk');
	}

	/**
	 * Get the player sprite that is me
	 * @public
	 * @returns {Phaser.Sprite} player
	 */
	public getMe() {
		return (this.me && this.me.alive) ? this.me : undefined;
	}

	/**
	 * Get a map of all the player sprites
	 * @public
	 * @returns {Object.<string, Phaser.Sprite>} sprites
	 */
	public getSprites() {
		return this.playersSprites;
	}

}

export default PlayersManager;