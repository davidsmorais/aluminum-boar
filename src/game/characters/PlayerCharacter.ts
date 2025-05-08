import { GAME_OPTIONS } from "../GameOptions";
import { Game } from "../scenes/Game";
import { BaseCharacter, BaseStats } from "./BaseCharacter";

export class PlayerCharacter extends BaseCharacter {
	level: Game;
	sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

	constructor(spriteName: string, level: Game, stats: BaseStats) {
		super(stats, level, spriteName);
		this.level = level;
		this.sprite = this.level.add.sprite(
			GAME_OPTIONS.gameSize.width / 2,
			GAME_OPTIONS.gameSize.height / 2,
			spriteName,
		) as Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
		return this;
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
}
