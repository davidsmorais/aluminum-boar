import { AUTO, Game } from "phaser";
import { GAME_OPTIONS } from "./GameOptions";
import { Boot } from "./scenes/Boot";
import { Game as MainGame } from "./scenes/Game";
import { GameOver } from "./scenes/GameOver";
import { MainMenu } from "./scenes/MainMenu";
import { Preloader } from "./scenes/Preloader";

// object to initialize the Scale Manager
const scaleObject: Phaser.Types.Core.ScaleConfig = {
	mode: Phaser.Scale.FIT, // adjust size to automatically fit in the window
	autoCenter: Phaser.Scale.CENTER_BOTH, // center the game horizontally and vertically
	width: GAME_OPTIONS.gameSize.width, // game width, in pixels
	height: GAME_OPTIONS.gameSize.height, // game height, in pixels
};

// game configuration object
const configObject: Phaser.Types.Core.GameConfig = {
	type: AUTO, // game renderer
	backgroundColor: GAME_OPTIONS.gameBackgroundColor, // game background color
	scale: scaleObject,
	width: 1024,
	height: 768,
	parent: "game-container",
	scene: [Boot, Preloader, MainMenu, MainGame, GameOver],
	physics: {
		default: "arcade", // physics engine used is arcade physics
	},
};

const StartGame = (parent: string) => {
	return new Game({ ...configObject, parent });
};

export default StartGame;
