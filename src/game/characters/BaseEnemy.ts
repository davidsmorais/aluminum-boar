import { EnemyStats, SpawnPoint } from "Types";
import Phaser from "phaser";
import { GAME_OPTIONS } from "../GameOptions";
import { Game } from "../scenes/Game";

export class BaseEnemy {
	protected stats: EnemyStats;
	level: Game;
	sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
	spriteName: string;
	constructor(
		spawnPoint: SpawnPoint,
		stats: EnemyStats,
		level: Game,
		spriteName: string,
	) {
		this.stats = stats;
		this.level = level;
		this.spriteName = spriteName;

		this.sprite = level.physics.add.sprite(
			spawnPoint.x,
			spawnPoint.y,
			spriteName,
		) as Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
	}

	getStats(): EnemyStats {
		return this.stats;
	}

	updateStats(newStats: Partial<EnemyStats>): void {
		this.stats = { ...this.stats, ...newStats };
	}

	isAlive(): boolean {
		return this.stats.currentHP > 0;
	}

	takeDamage(damage: number): void {
		this.stats.currentHP -= damage;
		if (this.stats.currentHP < 0) {
			this.stats.currentHP = 0;
		}
	}
	update(): void {
		if (this.sprite.anims.currentAnim?.key !== `${this.spriteName}_run`) {
			this.sprite.play({ key: `${this.spriteName}_run`, repeat: -1 });
		}
		if (this.sprite.body.velocity.x < 0 && this.sprite.flipX === false) {
			this.sprite.flipX = true;
		} else if (this.sprite.body.velocity.x > 0 && this.sprite.flipX === true) {
			this.sprite.flipX = false;
		}
		this.level.physics.moveToObject(
			this.sprite,
			this.level.player.sprite,
			GAME_OPTIONS.enemySpeed,
		);
	}
}
