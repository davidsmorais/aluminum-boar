import { WeaponStats } from "Types";

export class BaseWeapon {
	bullet: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
	stats: WeaponStats;
	constructor(stats: WeaponStats) {
		this.stats = stats;
	}
}
