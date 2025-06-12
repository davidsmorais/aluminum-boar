import { SpritesRat } from "src/types/assets";

export const RAT_ENEMY = {
	name: SpritesRat.getName(),
	stats: {
		maxHP: 10,
		currentHP: 10,
		attackDamage: 5,
		moveSpeed: 50,
		size: 1,
		spawnWeight: 1,
		experienceReward: 10,
		currencyDrop: 1,
		collisionDamage: true,
	},
};
