import {
	SpritesPlayer,
	SpritesRat,
	SpritesWeapons,
	TilemapsDemo,
	TilemapsTileset,
} from "../../types/assets";
import { GAME_OPTIONS } from "../GameOptions";
import { PlayerCharacter } from "../characters/PlayerCharacter";

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

			// Create the player sprite
			const playerSprite = this.physics.add.sprite(
				GAME_OPTIONS.gameSize.width / 2,
				GAME_OPTIONS.gameSize.height / 2,
				SpritesPlayer.getName(),
			);

			// Initialize the player character with stats and sprite
			this.player = new PlayerCharacter(
				"Player",
				1,
				{ health: 100, attack: 10, defense: 5, speed: 5 },
				playerSprite,
			);

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

		// set outer rectangle and inner rectangle; enemy spawn area is between these rectangles
		const outerRectangle: Phaser.Geom.Rectangle = new Phaser.Geom.Rectangle(
			this.player.sprite.x - 100,
			this.player.sprite.y - 100,
			GAME_OPTIONS.gameSize.width + 200,
			GAME_OPTIONS.gameSize.height + 200,
		);
		const innerRectangle: Phaser.Geom.Rectangle = new Phaser.Geom.Rectangle(
			this.player.sprite.x - 50,
			this.player.sprite.y - 50,
			GAME_OPTIONS.gameSize.width + 100,
			GAME_OPTIONS.gameSize.height + 100,
		);

		// timer event to add enemies
		this.time.addEvent({
			delay: GAME_OPTIONS.enemyRate,
			loop: true,
			callback: () => {
				const spawnPoint: Phaser.Geom.Point =
					Phaser.Geom.Rectangle.RandomOutside(outerRectangle, innerRectangle);
				const enemy: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody =
					this.physics.add.sprite(
						spawnPoint.x,
						spawnPoint.y,
						SpritesRat.getName(),
					);
				enemy.body.setSize(16, 16);
				enemy.body.setOffset(8, 16);
				this.enemyGroup.add(enemy);
			},
		});

		// timer event to fire bullets
		this.time.addEvent({
			delay: GAME_OPTIONS.bulletRate,
			loop: true,
			callback: () => {
				const closestEnemy: any = this.physics.closest(
					this.player.sprite,
					this.enemyGroup.getMatching("visible", true),
				);
				if (closestEnemy != null) {
					const bullet: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody =
						this.physics.add.sprite(
							this.player.sprite.x,
							this.player.sprite.y,
							SpritesWeapons.getName(),
						);
					bulletGroup.add(bullet);
					bullet.play("knife");

					bullet.body.setAllowRotation(true);
					bullet.rotation = Phaser.Math.Angle.Between(
						this.player.sprite.x,
						this.player.sprite.y,
						closestEnemy.x,
						closestEnemy.y,
					);
					bullet.body.setSize(2, 2);
					this.physics.moveToObject(
						bullet,
						closestEnemy,
						GAME_OPTIONS.bulletSpeed,
					);
				}
			},
		});

		// bullet Vs enemy collision
		this.physics.add.collider(
			bulletGroup,
			this.enemyGroup,
			(bullet: any, enemy: any) => {
				bulletGroup.killAndHide(bullet);
				bullet.body.checkCollision.none = true;
				this.enemyGroup.killAndHide(enemy);
				enemy.body.checkCollision.none = true;
			},
		);

		// player Vs enemy collision
		this.physics.add.collider(this.player.sprite, this.enemyGroup, () => {
			this.scene.restart();
		});
	}

	// metod to be called at each frame
	update() {
		// set movement direction according to keys pressed
		const movementDirection: Phaser.Math.Vector2 = new Phaser.Math.Vector2(
			0,
			0,
		);
		if (this.controlKeys.right.isDown) {
			this.player.sprite.flipX = false;
			movementDirection.x++;
		}
		if (this.controlKeys.left.isDown) {
			this.player.sprite.flipX = true;
			movementDirection.x--;
		}
		if (this.controlKeys.up.isDown) {
			movementDirection.y--;
		}
		if (this.controlKeys.down.isDown) {
			movementDirection.y++;
		}

		// set player velocity according to movement direction
		this.player.sprite.setVelocity(0, 0);
		if (movementDirection.x === 0 || movementDirection.y === 0) {
			this.player.sprite.setVelocity(
				movementDirection.x * GAME_OPTIONS.playerSpeed,
				movementDirection.y * GAME_OPTIONS.playerSpeed,
			);
		} else {
			this.player.sprite.setVelocity(
				(movementDirection.x * GAME_OPTIONS.playerSpeed) / Math.sqrt(2),
				(movementDirection.y * GAME_OPTIONS.playerSpeed) / Math.sqrt(2),
			);
		}

		// Play "run" animation if moving, stop animation if not
		if (movementDirection.x !== 0 || movementDirection.y !== 0) {
			if (this.player.sprite.anims.currentAnim?.key !== "run") {
				this.player.sprite.play({ key: "run", repeat: -1 });
			}
		} else {
			this.player.sprite.play("idle", true);
		}

		// move enemies towards player
		this.enemyGroup.getMatching("visible", true).forEach((enemy) => {
			if (enemy.anims.currentAnim?.key !== "rat_run") {
				enemy.play({ key: "rat_run", repeat: -1 });
			}
			if (enemy.body.velocity.x < 0 && enemy.flipX === false) {
				enemy.flipX = true;
			} else if (enemy.body.velocity.x > 0 && enemy.flipX === true) {
				enemy.flipX = false;
			}
			this.physics.moveToObject(enemy, this.player.sprite, GAME_OPTIONS.enemySpeed);
		});
	}
}
