import { EnemyWave } from "Types";
import { GAME_OPTIONS } from "../GameOptions";
import { BaseEnemy } from "../characters/BaseEnemy";
import { Game } from "../scenes/Game";
import ENEMY_WAVES from "./WAVES";

interface EnemySpawnerConfig {
	outerRectangle: {
		x: number;
		y: number;
		width: number;
		height: number;
	};
	innerRectangle: {
		x: number;
		y: number;
		width: number;
		height: number;
	};
	enemyWaves: EnemyWave[];
}

export class EnemySpawner {
	player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody; // the player
	enemyGroup: Phaser.Physics.Arcade.Group; // group with all enemies
	colliderLayers: Phaser.Tilemaps.TilemapLayer | null; // layer with all tiles that collide
	enemies: BaseEnemy[] = []; // array to keep track of spawned enemies
	constructor(level: Game, config?: EnemySpawnerConfig) {
		this.player = level.player.sprite;
		this.enemyGroup = level.enemyGroup;
		this.colliderLayers = level.colliderLayers;

		const enemyWaves = config?.enemyWaves || ENEMY_WAVES;

		// set outer rectangle and inner rectangle; enemy spawn area is between these rectangles
		const outerRectangle: Phaser.Geom.Rectangle = new Phaser.Geom.Rectangle(
			this.player.x - (config?.outerRectangle?.x || 100),
			this.player.y - (config?.outerRectangle?.y || 100),
			GAME_OPTIONS.gameSize.width + (config?.outerRectangle?.width || 200),
			GAME_OPTIONS.gameSize.height + (config?.outerRectangle?.height || 200),
		);
		const innerRectangle: Phaser.Geom.Rectangle = new Phaser.Geom.Rectangle(
			this.player.x - (config?.innerRectangle?.x || 50),
			this.player.y - (config?.innerRectangle?.y || 50),
			GAME_OPTIONS.gameSize.width + (config?.innerRectangle?.width || 100),
			GAME_OPTIONS.gameSize.height + (config?.innerRectangle?.height || 100),
		);

		const wave = enemyWaves[0]; // TODO: Loop over all waves
		// timer event to add enemies
		level.time.addEvent({
			startAt: wave.delay,
			delay: GAME_OPTIONS.enemyRate,
			loop: true,
			callback: () => {
				for (let index = 0; index < wave.count; index++) {
					const spawnPoint: Phaser.Geom.Point =
						Phaser.Geom.Rectangle.RandomOutside(outerRectangle, innerRectangle);
					const enemy = new BaseEnemy(
						spawnPoint,
						wave.enemy.stats,
						level,
						wave.enemy.name,
					);
					enemy.sprite.body.setSize(16, 16);
					enemy.sprite.body.setOffset(8, 16);
					enemy.sprite.baseEnemyRef = enemy; // Reference to the BaseEnemy instance
					this.enemyGroup.add(enemy.sprite);
				}
			},
		});
	}
}
