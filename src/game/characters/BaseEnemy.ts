import { EnemyStats, SpawnPoint } from "Types";
import Phaser from "phaser";
import { GAME_OPTIONS } from "../GameOptions";
import { Game } from "../scenes/Game";

export class BaseEnemy {
	protected stats: EnemyStats;
	sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

	constructor(
		spawnPoint: SpawnPoint,
		stats: EnemyStats,
		level: Game,
		spriteName: string,
	) {
		this.stats = stats;

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
}
