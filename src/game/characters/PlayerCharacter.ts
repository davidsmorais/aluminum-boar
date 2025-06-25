import { GAME_OPTIONS } from "Game/GameOptions";
import { Game } from "Scenes/Game";
import { CharacterStats } from "Types";
import { BaseCharacter } from "./BaseCharacter";

export class PlayerCharacter extends BaseCharacter {
	level: Game;

	constructor(spriteName: string, level: Game, stats: CharacterStats) {
		super(stats, level, spriteName);
		this.level = level;
	}

	focusCamera(scene: Phaser.Scene): void {
		scene.cameras.main.startFollow(this.sprite, true, 0.1, 0.1);
	}

	levelUp(): void {
		const currentStats = this.getStats();
		this.updateStats({
			level: currentStats.level + 1,
			health: currentStats.health + 10,
			attack: currentStats.attack + 2,
			defense: currentStats.defense + 2,
			speed: currentStats.speed + 1,
		});
	}
	update() {
		// set movement direction according to keys pressed
		const movementDirection: Phaser.Math.Vector2 = new Phaser.Math.Vector2(
			0,
			0,
		);
		if (this.level.controlKeys.right.isDown) {
			this.level.player.sprite.flipX = false;
			movementDirection.x++;
		}
		if (this.level.controlKeys.left.isDown) {
			this.level.player.sprite.flipX = true;
			movementDirection.x--;
		}
		if (this.level.controlKeys.up.isDown) {
			movementDirection.y--;
		}
		if (this.level.controlKeys.down.isDown) {
			movementDirection.y++;
		}

		// set player velocity according to movement direction
		this.sprite.setVelocity(0, 0);
		if (movementDirection.x === 0 || movementDirection.y === 0) {
			this.sprite.setVelocity(
				movementDirection.x * GAME_OPTIONS.playerSpeed,
				movementDirection.y * GAME_OPTIONS.playerSpeed,
			);
		} else {
			this.sprite.setVelocity(
				(movementDirection.x * GAME_OPTIONS.playerSpeed) / Math.sqrt(2),
				(movementDirection.y * GAME_OPTIONS.playerSpeed) / Math.sqrt(2),
			);
		}

		// Play "run" animation if moving, stop animation if not
		if (movementDirection.x !== 0 || movementDirection.y !== 0) {
			if (this.sprite.anims.currentAnim?.key !== "run") {
				this.sprite.play({ key: "run", repeat: -1 });
			}
		} else {
			this.sprite.play("idle", true);
		}
	}
}
