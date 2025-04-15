import { SpritesPlayer } from "../../types/assets";
import { GAME_OPTIONS } from "../GameOptions";

// PlayGame class extends Phaser.Scene class
export class Game extends Phaser.Scene {
	constructor() {
		super({
			key: "Game",
		});
	}

	controlKeys: any; // keys used to move the player
	player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody; // the player
	enemyGroup: Phaser.Physics.Arcade.Group; // group with all enemies

	// method to be called once the instance has been created
	create(): void {
		// NOTE: add animations to scene animations manager
		this.anims.createFromAseprite(SpritesPlayer.getName());

		// add player, enemies group and bullets group
		this.player = this.physics.add.sprite(
			GAME_OPTIONS.gameSize.width / 2,
			GAME_OPTIONS.gameSize.height / 2,
			SpritesPlayer.getName(),
		);
		this.enemyGroup = this.physics.add.group();
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
			-100,
			-100,
			GAME_OPTIONS.gameSize.width + 200,
			GAME_OPTIONS.gameSize.height + 200,
		);
		const innerRectangle: Phaser.Geom.Rectangle = new Phaser.Geom.Rectangle(
			-50,
			-50,
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
					this.physics.add.sprite(spawnPoint.x, spawnPoint.y, "enemy");
				this.enemyGroup.add(enemy);
			},
		});

		// timer event to fire bullets
		this.time.addEvent({
			delay: GAME_OPTIONS.bulletRate,
			loop: true,
			callback: () => {
				const closestEnemy: any = this.physics.closest(
					this.player,
					this.enemyGroup.getMatching("visible", true),
				);
				if (closestEnemy != null) {
					const bullet: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody =
						this.physics.add.sprite(this.player.x, this.player.y, "bullet");
					bulletGroup.add(bullet);
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
		this.physics.add.collider(this.player, this.enemyGroup, () => {
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
			movementDirection.x++;
		}
		if (this.controlKeys.left.isDown) {
			movementDirection.x--;
		}
		if (this.controlKeys.up.isDown) {
			movementDirection.y--;
		}
		if (this.controlKeys.down.isDown) {
			movementDirection.y++;
		}

		// set player velocity according to movement direction
		this.player.setVelocity(0, 0);
		if (movementDirection.x === 0 || movementDirection.y === 0) {
			this.player.setVelocity(
				movementDirection.x * GAME_OPTIONS.playerSpeed,
				movementDirection.y * GAME_OPTIONS.playerSpeed,
			);
		} else {
			this.player.setVelocity(
				(movementDirection.x * GAME_OPTIONS.playerSpeed) / Math.sqrt(2),
				(movementDirection.y * GAME_OPTIONS.playerSpeed) / Math.sqrt(2),
			);
		}

		// Play "run" animation if moving, stop animation if not
		if (movementDirection.x !== 0 || movementDirection.y !== 0) {
			if (this.player.anims.currentAnim?.key !== "run") {
				this.player.play("run", true);
			}
		} else {
			this.player.play("idle", true);
		}

		// move enemies towards player
		this.enemyGroup.getMatching("visible", true).forEach((enemy) => {
			this.physics.moveToObject(enemy, this.player, GAME_OPTIONS.enemySpeed);
		});
	}
}
