export interface CharacterStats {
	level: number;
	health: number;
	attack: number;
	defense: number;
	speed: number;
}

export interface SpawnPoint {
	x: number;
	y: number;
}
export interface EnemyStats {
	maxHP: number;
	currentHP: number;
	attackDamage: number;
	moveSpeed: number;
	size: number; // Influences hitbox and potential for blocking
	spawnWeight: number; // Relative probability of this enemy spawning
	experienceReward: number;
	currencyDrop: number;
	collisionDamage: boolean; // Does this enemy deal damage on contact?
	projectileResistance?: Record<string, number>; // Resistance to specific projectile types ('magic': 0.5 means 50% damage)
	weaknesses?: Record<string, number>; // Vulnerabilities to specific projectile types ('fire': 1.5 means 150% damage)
	specialAbilities?: string[]; // List of special abilities (e.g., "charges", "teleports")
}

export interface EnemyWave {
	rate: number;
	delay: number;
	count: number;
	enemy: {
		name: string; // name of the enemy sprite
		stats: EnemyStats;
	}; // TODO: replace with enemy class
}

export interface WeaponStats {
	// Base stats
	range: number;
	projectileSpeed: number;
	damage: number; // Base damage value before any multipliers
	pierce: number; // Number of enemies a projectile can pass through (0 for no pierce)
	aoeRadius: number; // Radius of the area of effect (0 for single target)
	attackSpeed: number; // Attacks per second (higher is faster)
	projectileCount: number; // Number of projectiles launched per attack
	cooldown: number; // Time in seconds between attacks (alternative to attackSpeed for burst weapons)

	// Visual/FX
	projectileSprite?: string;
	impactEffect?: string;
}
