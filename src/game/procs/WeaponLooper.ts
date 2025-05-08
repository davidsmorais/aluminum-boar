import { SpritesWeapons } from "../../types/assets";
import { GAME_OPTIONS } from "../GameOptions";
import { Game } from "../scenes/Game";

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
					const bullet: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody =
						level.physics.add.sprite(
							level.player.sprite.x,
							level.player.sprite.y,
							SpritesWeapons.getName(),
						);
					bulletsGroup.add(bullet);
					bullet.play("knife");

					bullet.body.setAllowRotation(true);
					bullet.rotation = Phaser.Math.Angle.Between(
						level.player.sprite.x,
						level.player.sprite.y,
						closestEnemy.x,
						closestEnemy.y,
					);
					bullet.body.setSize(2, 2);
					level.physics.moveToObject(
						bullet,
						closestEnemy,
						GAME_OPTIONS.bulletSpeed,
					);
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
