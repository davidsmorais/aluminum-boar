import { GAME_OPTIONS } from "../GameOptions";
import { Game } from "../scenes/Game";
import { Knife } from "./weapons/knife";

export class WeaponLooper {
	constructor(level: Game, bulletsGroup: Phaser.Physics.Arcade.Group) {
		level.time.addEvent({
			delay: GAME_OPTIONS.bulletRate, // TODO: replace with player.attackSpeed,
			loop: true,
			callback: () => {
				// TODO: itterate over player.weapons and do new Weapon() for each
				const closestEnemy: any = level.physics.closest(
					level.player.sprite,
					level.enemyGroup.getMatching("visible", true),
				);
				if (closestEnemy != null) {
					new Knife(level, bulletsGroup, closestEnemy);
				}
			},
		});

		// bullet Vs enemy collision
		level.physics.add.collider(
			bulletsGroup,
			level.enemyGroup,
			(bullet: any, enemy: any) => {
				bulletsGroup.killAndHide(bullet);
				bullet.body.checkCollision.none = true;
				level.enemyGroup.killAndHide(enemy);
				enemy.body.checkCollision.none = true;
			},
		);
	}
}
