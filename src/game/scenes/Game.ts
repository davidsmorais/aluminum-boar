import {
	SpritesPlayer,
	SpritesRat,
	SpritesWeapons,
	TilemapsDemo,
	TilemapsTileset,
} from "Assets";
import { PlayerCharacter } from "../characters/PlayerCharacter";
import { EnemySpawner } from "../procs/EnemySpawner";
import { WeaponLooper } from "../procs/WeaponLooper";

// PlayGame class extends Phaser.Scene class
export class Game extends Phaser.Scene {
	constructor() {
		super({
			key: "Game",
		});
	}

	controlKeys: any; // keys used to move the player
	player: PlayerCharacter; // player character
	enemyGroup: Phaser.Physics.Arcade.Group; // group with all enemies
	colliderLayers: Phaser.Tilemaps.TilemapLayer | null; // layer with all tiles that collide
	// method to be called once the instance has been created
	create(): void {
		// NOTE: add animations to scene animations manager
		this.anims.createFromAseprite(SpritesPlayer.getName());
		this.anims.createFromAseprite(SpritesRat.getName());
		this.anims.createFromAseprite(SpritesWeapons.getName());
		// add player, enemies group and bullets group
		// Create the tilemap
		const map = this.make.tilemap({ key: TilemapsDemo.getName() });

		// Add the tileset image to the map
		const tileset = map.addTilesetImage(
			"basic_tiles",
			TilemapsTileset.getName(),
		);

		if (tileset) {
			// Create layers from the tilemap
			this.colliderLayers = map.createLayer("layer", tileset, 0, 0);

			// Initialize the player character with stats and sprite
			this.player = new PlayerCharacter(SpritesPlayer.getName(), this, {
				health: 100,
				attack: 10,
				defense: 5,
				speed: 5,
				level: 1,
			});

			// focus camera on player
			this.player.focusCamera(this);

			// Create the enemy group
			this.enemyGroup = this.physics.add.group({});
			if (this.colliderLayers) {
				// Set collision for the obstacles layer
				this.colliderLayers.setCollisionByProperty({ collide: true });

				this.physics.add.collider(this.player.sprite, this.colliderLayers);
				this.physics.add.collider(this.enemyGroup, this.colliderLayers);
			}
		}

		const bulletGroup: Phaser.Physics.Arcade.Group = this.physics.add.group();

		// set keyboard controls
		const keyboard: Phaser.Input.Keyboard.KeyboardPlugin = this.input
			.keyboard as Phaser.Input.Keyboard.KeyboardPlugin;
		this.controlKeys = keyboard.addKeys({
			up: Phaser.Input.Keyboard.KeyCodes.W,
			left: Phaser.Input.Keyboard.KeyCodes.A,
			down: Phaser.Input.Keyboard.KeyCodes.S,
			right: Phaser.Input.Keyboard.KeyCodes.D,
		});

		new EnemySpawner(this);
		new WeaponLooper(this, bulletGroup);
		// player Vs enemy collision
		this.physics.add.collider(this.player.sprite, this.enemyGroup, () => {
			this.scene.restart();
		});
	}

	// metod to be called at each frame
	update() {
		this.player.update();
		// move enemies towards player
		this.enemyGroup.getMatching("visible", true).forEach((enemy) => {
			enemy.update();
		});
	}
}
