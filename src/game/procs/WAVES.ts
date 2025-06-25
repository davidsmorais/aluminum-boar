import { RAT_ENEMY } from "Characters/ENEMIES";
import { GAME_OPTIONS } from "Game/GameOptions";

const ENEMY_WAVES = [
	{
		enemy: RAT_ENEMY,
		rate: GAME_OPTIONS.enemyRate,
		delay: 1000,
		count: 1,
	},
];

export default ENEMY_WAVES;
