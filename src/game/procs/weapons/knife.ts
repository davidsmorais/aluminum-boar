import { SpritesWeapons } from "Assets";
import { GAME_OPTIONS } from "src/game/GameOptions";
import { Game } from "src/game/scenes/Game";
import { BaseWeapon } from "./BaseWeapon";
import { WEAPON_STATS } from "./STATS";

export class Knife extends BaseWeapon {
	bullet: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
	constructor(
		level: Game,
		bulletsGroup: Phaser.Physics.Arcade.Group,
		closestEnemy: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody,
	) {
		super(WEAPON_STATS.KNIFE);
		this.bullet = level.physics.add.sprite(
			level.player.sprite.x,
			level.player.sprite.y,
			SpritesWeapons.getName(),
		);
		bulletsGroup.add(this.bullet);
		this.bullet.play("knife");

		this.bullet.body.setAllowRotation(true);
		this.bullet.rotation = Phaser.Math.Angle.Between(
			level.player.sprite.x,
			level.player.sprite.y,
			closestEnemy.x,
			closestEnemy.y,
		);
		this.bullet.body.setSize(2, 2);
		level.physics.moveToObject(
			this.bullet,
			closestEnemy,
			GAME_OPTIONS.bulletSpeed,
		);
	}
}
