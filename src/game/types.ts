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
