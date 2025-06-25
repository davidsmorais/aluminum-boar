import { GAME_OPTIONS } from "Game/GameOptions";
import { Game } from "Scenes/Game";
import { CharacterStats } from "Types";

export class BaseCharacter {
	protected stats: CharacterStats;
	sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

	constructor(stats: CharacterStats, level: Game, spriteName: string) {
		this.stats = stats;

		this.sprite = level.physics.add.sprite(
			GAME_OPTIONS.gameSize.width / 2,
			GAME_OPTIONS.gameSize.height / 2,
			spriteName,
		) as Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
	}

	getStats(): CharacterStats {
		return this.stats;
	}

	updateStats(newStats: Partial<CharacterStats>): void {
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
