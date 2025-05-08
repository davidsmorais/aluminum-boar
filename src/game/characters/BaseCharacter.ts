import { GAME_OPTIONS } from "../GameOptions";
import { Game } from "../scenes/Game";

export interface BaseStats {
	level: number;
	health: number;
	attack: number;
	defense: number;
	speed: number;
}

export class BaseCharacter {
	protected stats: BaseStats;
	sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

	constructor(stats: BaseStats, level: Game, spriteName: string) {
		this.stats = stats;

		this.sprite = level.add.sprite(
			GAME_OPTIONS.gameSize.width / 2,
			GAME_OPTIONS.gameSize.height / 2,
			spriteName,
		) as Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
	}

	getStats(): BaseStats {
		return this.stats;
	}

	updateStats(newStats: Partial<BaseStats>): void {
		this.stats = { ...this.stats, ...newStats };
	}

	isAlive(): boolean {
		return this.stats.health > 0;
	}

	takeDamage(damage: number): void {
		this.stats.health -= damage;
		if (this.stats.health < 0) {
			this.stats.health = 0;
		}
	}
}
